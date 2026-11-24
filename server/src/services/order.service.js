import { getIikoToken, fetchMenuFromIiko } from './iiko.service.js';
import { getTableInfo, getLiveTableOrder, setTableLiveStatus } from './table.service.js';

export async function getActiveOrderForTable(tableId, orgId, token, logger) {
  const response = await fetch('https://api-ru.iiko.services/api/1/order/by_table', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationIds: [orgId],
      tableIds: [tableId],
      statuses: ['New', 'Bill'],
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const rawOrders = Array.isArray(data?.orders) ? data.orders : [];

  const now = Date.now();
  // Отбираем только заказы текущей смены (не старше 14 часов), исключая закрытые и удалённые
  const validRecentOrders = rawOrders
    .filter((o) => {
      const order = o.order;
      if (!order) return false;
      if (order.status === 'Closed' || order.status === 'Deleted') return false;
      const createdTime = order.whenCreated ? new Date(order.whenCreated).getTime() : 0;
      return now - createdTime < 14 * 60 * 60 * 1000;
    })
    .sort(
      (a, b) =>
        new Date(b.order?.whenCreated || 0).getTime() -
        new Date(a.order?.whenCreated || 0).getTime()
    );

  return validRecentOrders[0] || null;
}

export async function createDineInOrder(orderData, logger) {
  const { tableNumber, items, phone, comment } = orderData;

  const tableInfo = getTableInfo(tableNumber);

  await fetchMenuFromIiko(logger);

  const orderItems = items.map((item, index) => {
    let itemComment = '';
    if (index === 0 && (phone || comment)) {
      itemComment = ` ${phone || 'Без номера'} |  ${comment || 'Нет комментария'}`;
    }

    const orderItem = {
      productId: item.productId,
      type: 'Product',
      amount: item.amount,
    };

    if (itemComment) orderItem.comment = itemComment;
    return orderItem;
  });

  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();
  const token = await getIikoToken(logger);

  const activeOrder = await getActiveOrderForTable(tableInfo.tableId, cleanOrgId, token, logger);
  let isAddedToExisting = false;

  if (activeOrder) {
    logger.info(`Na stole ${tableNumber} naiden otkritiy zakaz (${activeOrder.id}). Delaem dozakaz!`);

    const addItemsPayload = {
      organizationId: cleanOrgId,
      orderId: activeOrder.id,
      items: orderItems,
    };

    try {
      const response = await fetch('https://api-ru.iiko.services/api/1/order/add_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addItemsPayload),
      });

      if (response.ok) {
        const addData = await response.json();
        if (addData.correlationId) {
          const statRes = await fetch('https://api-ru.iiko.services/api/1/commands/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              organizationId: cleanOrgId,
              correlationId: addData.correlationId,
            }),
          });
          const statData = await statRes.json();
          if (statData.state === 'Error') {
            logger.warn(
              `iikoFront otklonil add_items (${statData.exception?.errorCode}): ${statData.exception?.message}. Sozdaem noviy zakaz!`
            );
            isAddedToExisting = false;
          } else {
            isAddedToExisting = true;
          }
        } else {
          isAddedToExisting = true;
        }
      }
    } catch (err) {
      logger.warn(`Oshibka pri add_items: ${err.message}. Sozdaem noviy zakaz.`);
      isAddedToExisting = false;
    }

    if (isAddedToExisting) {
      logger.info(`Dozakaz uspeshno otpravlen v chek!`);
      return { status: 'added_to_existing', orderId: activeOrder.id, tableNumber };
    }
  }

  // Если активного чека нет или старый был отвергнут кассой -> создаём свежий заказ на стол в зале
  logger.info(`Stol ${tableNumber} svoboden. Sozdaem noviy chek v zale`);
  const commonOrderTypeId = (
    process.env.IIKO_ORDER_TYPE_COMMON_ID || 'bbbef4dc-5a02-7ea3-81d3-826f4e8bb3e0'
  ).trim();

  const createPayload = {
    organizationId: cleanOrgId,
    terminalGroupId: tableInfo.terminalGroupId,
    order: {
      orderTypeId: commonOrderTypeId,
      tableIds: [tableInfo.tableId],
      phone: phone || null,
      guests: { count: 1 },
      items: orderItems,
      comment: comment || 'Zakaz cherez QR-menu',
    },
  };

  const response = await fetch('https://api-ru.iiko.services/api/1/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(createPayload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error(`Oshibka pri sozdanii zakaza: ${errorBody}`);
    throw new Error(`Kassa otklonila zakaz. Poprobuite pozhe: ${errorBody}`);
  }

  const result = await response.json();
  const newOrderId = result.orderInfo?.id || result.correlationId;
  logger.info(
    `Zakaz uspeshno otpravlen v iiko (ID: ${newOrderId}, correlationId: ${result.correlationId})`
  );

  // Моментально регистрируем позиции в живом статусе стола, чтобы /table-bill сразу вернул счёт гостю
  const liveItems = items.map((it) => ({
    id: it.productId,
    name: it.name || 'Блюдо из заказа',
    amount: it.amount || 1,
    price: it.price || 0,
    sum: (it.price || 0) * (it.amount || 1),
    modifiers: [],
  }));

  setTableLiveStatus(tableNumber, true, {
    orderId: newOrderId,
    orderNumber: result.orderInfo?.externalNumber || 'Новый',
    status: 'New',
    sum: liveItems.reduce((acc, it) => acc + it.sum, 0),
    items: liveItems,
  });

  return { status: 'created', orderId: newOrderId, tableNumber };
}

/**
 * Получение текущего открытого счёта (чека) стола из iikoCloud и Webhook-кэша
 */
export async function getTableBill(tableNumber, logger) {
  const tableInfo = getTableInfo(tableNumber);
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();
  const token = await getIikoToken(logger);

  // Ссылка для оплаты через Tapper
  const tapperTemplate =
    process.env.TAPPER_URL_TEMPLATE || 'https://tapper.cloud/gusto-lounge-18198/{table}';
  const tapperUrl = tapperTemplate.replace('{table}', encodeURIComponent(tableNumber));

  // 1. Проверяем заказ через облачный API
  let activeOrder = await getActiveOrderForTable(tableInfo.tableId, cleanOrgId, token, logger);
  let orderData = activeOrder?.order || null;

  // 2. Если в API заказ ещё не виден или пуст, проверяем живой кэш вебхуков от iikoFront
  const liveOrder = getLiveTableOrder(tableNumber);

  if (!orderData && liveOrder && liveOrder.status !== 'Closed' && liveOrder.status !== 'Deleted') {
    orderData = {
      id: liveOrder.orderId,
      number: liveOrder.orderNumber,
      status: liveOrder.status,
      sum: liveOrder.sum,
      items: liveOrder.items || [],
    };
  }

  if (!orderData) {
    return { hasActiveBill: false, bill: null };
  }

  if (orderData.status === 'Closed' || orderData.status === 'Deleted') {
    return { hasActiveBill: false, isClosed: true, bill: null };
  }

  // Если в liveOrder позиций больше (например, официант только что на кассе вбил кальян), объединяем/используем их
  const rawItems =
    Array.isArray(liveOrder?.items) && liveOrder.items.length > (orderData.items || []).length
      ? liveOrder.items
      : Array.isArray(orderData.items)
      ? orderData.items
      : [];

  const items = rawItems
    .filter((item) => !item.deleted)
    .map((item) => {
      const amount = Number(item.amount) || 1;
      const sum = Number(item.resultSum ?? item.sum ?? (item.price || 0) * amount);
      return {
        id: item.product?.id || item.id || Math.random().toString(36).slice(2),
        name: item.product?.name || item.name || 'Позиция',
        amount,
        price: Number(item.price) || (amount > 0 ? Math.round(sum / amount) : sum),
        sum,
        modifiers: Array.isArray(item.modifiers)
          ? item.modifiers.map((m) => m.product?.name || m.name).filter(Boolean)
          : [],
      };
    });

  const calculatedSum = items.reduce((acc, it) => acc + it.sum, 0);
  const finalSum = Number(orderData.sum) || (calculatedSum > 0 ? calculatedSum : Number(liveOrder?.sum) || 0);

  return {
    hasActiveBill: true,
    bill: {
      orderId: orderData.id || activeOrder?.id || liveOrder?.orderId,
      orderNumber: orderData.number || liveOrder?.orderNumber || null,
      status: orderData.status,
      sum: finalSum,
      items,
      tapperUrl,
    },
  };
}

/**
 * Инициация оплаты счёта гостем (Tapper, СБП, Карта онлайн) или вызов официанта (доп. опция)
 */
export async function payTableBill({ tableNumber, paymentMethod = 'tapper', tipAmount = 0 }, logger) {
  const { hasActiveBill, bill } = await getTableBill(tableNumber, logger);
  if (!hasActiveBill || !bill) {
    throw new Error('На этом столике нет открытого счёта для оплаты.');
  }

  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();

  // 1. Оплата через Tapper (основной сценарий)
  if (paymentMethod === 'tapper') {
    logger.info(`[BILL] Стол №${tableNumber} переходит к оплате через Tapper (${bill.tapperUrl})`);
    return {
      status: 'tapper_redirect',
      tapperUrl: bill.tapperUrl,
      orderId: bill.orderId,
      orderNumber: bill.orderNumber,
      tableNumber,
      sum: bill.sum,
    };
  }

  // 2. Вызов официанта с терминалом
  if (paymentMethod === 'waiter') {
    logger.info(`[BILL] Стол №${tableNumber} запросил официанта для расчёта (чек #${bill.orderNumber}, сумма ${bill.sum}₽)`);
    try {
      const token = await getIikoToken(logger);
      await fetch('https://api-ru.iiko.services/api/1/order/change_comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          organizationId: cleanOrgId,
          orderId: bill.orderId,
          comment: `[ПРОСИТ СЧЁТ — Стол ${tableNumber}]`,
        }),
      });
    } catch (err) {
      logger.warn(`Не удалось обновить комментарий в iiko при вызове официанта: ${err.message}`);
    }

    return {
      status: 'waiter_called',
      orderId: bill.orderId,
      orderNumber: bill.orderNumber,
      tableNumber,
      sum: bill.sum,
    };
  }

  const safeTip = Math.max(0, Math.round(Number(tipAmount) || 0));
  const totalAmount = bill.sum + safeTip;

  // Проверяем, подключен ли эквайринг (ЮKassa / Т-Банк / CloudPayments)
  const hasAcquiring = Boolean(
    process.env.YOOKASSA_SHOP_ID || process.env.TBANK_TERMINAL_KEY || process.env.PAYMENT_GATEWAY_KEY
  );

  if (!hasAcquiring) {
    logger.info(
      `[BILL] Гость за столом №${tableNumber} выбрал оплату (${paymentMethod}) на сумму ${totalAmount}₽ (чек ${bill.sum}₽ + чаевые ${safeTip}₽). Ожидается подключение ключей эквайринга.`
    );
    return {
      status: 'acquiring_not_configured',
      method: paymentMethod,
      orderId: bill.orderId,
      orderNumber: bill.orderNumber,
      orderSum: bill.sum,
      tipAmount: safeTip,
      totalAmount,
    };
  }

  // Точка интеграции реального платёжного шлюза -> возврат confirmationUrl (СБП QR / форма карты)
  return {
    status: 'payment_created',
    method: paymentMethod,
    orderId: bill.orderId,
    orderNumber: bill.orderNumber,
    orderSum: bill.sum,
    tipAmount: safeTip,
    totalAmount,
  };
}

/**
 * Закрытие оплаченного счёта в iiko после подтверждения от платёжного шлюза (Webhook)
 */
export async function confirmExternalOrderPayment({ orderId, amount }, logger) {
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();
  const paymentTypeId = (process.env.IIKO_ONLINE_PAYMENT_TYPE_ID || '').trim();
  if (!paymentTypeId) {
    throw new Error('Не задан IIKO_ONLINE_PAYMENT_TYPE_ID для закрытия онлайн-оплаты в iiko.');
  }

  const token = await getIikoToken(logger);

  const addPaymentRes = await fetch('https://api-ru.iiko.services/api/1/order/add_payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationId: cleanOrgId,
      orderId,
      payments: [
        {
          paymentTypeKind: 'Card',
          sum: amount,
          paymentTypeId,
          isProcessedExternally: true,
        },
      ],
    }),
  });

  if (!addPaymentRes.ok) {
    const errText = await addPaymentRes.text();
    throw new Error(`Ошибка add_payments в iiko: ${errText}`);
  }

  const closeRes = await fetch('https://api-ru.iiko.services/api/1/order/close', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationId: cleanOrgId,
      orderId,
    }),
  });

  if (!closeRes.ok) {
    const errText = await closeRes.text();
    logger.warn(`add_payments выполнен, но order/close вернул ошибку: ${errText}`);
  }

  return { success: true, orderId };
}
