import { getIikoToken, fetchMenuFromIiko } from './iiko.service.js';
import { getTableInfo } from './table.service.js';



async function getActiveOrderForTable(tableId, orgId, token, logger) {
  const response = await fetch('https://api-ru.iiko.services/api/1/order/by_table', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationIds: [orgId],
      tableIds: [tableId],
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data && data.orders && data.orders.length > 0) {
    return data.orders[0];
  }
  return null;
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

  const activeOrder = await getActiveOrderForTable(tableInfo.tableId, cleanOrgId);
  if (activeOrder) {
    logger.info(`Na stole ${tableNumber} naiden otkritiy zakaz (${activeOrder.id}). Delaem dozakaz!`);

    const addItemsPayload = {
      organizationId: cleanOrgId,
      orderId: activeOrder.id,
      items: orderItems,
    };
    const response = await fetch('https://api-ru.iiko.services/api/1/order/add_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addItemsPayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(` Oshibka iiko pri dozakaze: ${errorBody}`);
      throw new Error('Ne udalos` dobavit` bluda v sushestvuyushiy chek.');
    }

    logger.info(` Dozakaz uspeshno otpravken v chek!`);
    return { status: 'added_to_existing', orderId: activeOrder.id };
  } else {
    logger.info(`Stol ${tableNumber} svoboden. Sozdaem noviy chek`);
    const createPayload = {
      organizationId: cleanOrgId,
      terminalGroupId: tableInfo.terminalGroupId,
      order: {
        tableIds: [tableInfo.tableId],
        phone: phone || null,
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
      logger.error(`Oshibka pri sozdanii zakaza:  ${errorBody}`);
      throw new Error(`Kassa otklonika zakaz. Poprobuite pozhe. ${errorBody}`);
    }
    const result = await response.json();
    logger.info(`Zakaz uspeshno sozdan. ID v sisteme IIKO : ${result.orderInfo.id}`);

    return result.orderInfo;
  }
}
