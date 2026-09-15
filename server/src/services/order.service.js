import { getIikoToken, fetchMenuFromIiko } from './iiko.service.js';
import { getTableInfo } from './table.service.js';

export async function createDineInOrder(orderData, logger) {
  const { tableNumber, items, phone, comment } = orderData;

  const tableInfo = getTableInfo(tableNumber);

  await fetchMenuFromIiko(logger);

  const orderItems = items.map((item) => ({
    productId: item.productId,
    type: 'Product',
    amount: item.amount,
  }));

  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();

  const token = await getIikoToken(logger);

  const payload = {
    organizationId: cleanOrgId,
    terminalGroupId: tableInfo.terminalGroupId,
    order: {
      tableIds: [tableInfo.tableId],
      phone: phone || null,
      items: orderItems,
      comment: comment || 'Zakaz cherez QR-menu',
    },
  };
  logger.info(`Otpravlyaem zakaz na stol ${tableInfo.tableName}: ${JSON.stringify(payload)}`);

  const response = await fetch('https://api-ru.iiko.services/api/1/order/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
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
