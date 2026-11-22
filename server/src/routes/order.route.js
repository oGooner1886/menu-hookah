import { createDineInOrder, getTableBill, payTableBill } from '../services/order.service.js';
import { getUserByToken } from '../services/auth.service.js';
import { isValidTableSign } from '../services/security.service.js';

function verifyTableAccess(tableNumber, tableSign, request, reply) {
  if (!tableNumber) {
    reply.status(400).send({ success: false, error: 'Не указан номер стола.' });
    return false;
  }

  if (process.env.ALLOW_UNSIGNED_TABLE !== 'true') {
    if (!tableSign || !isValidTableSign(tableNumber, tableSign)) {
      request.log.warn(`[SECURITY] Доступ к столу №${tableNumber} без валидной подписи QR: "${tableSign}"`);
      reply.status(403).send({
        success: false,
        error: 'Недействительная подпись столика.',
      });
      return false;
    }
  }

  return true;
}

export default async function orderRoutes(fastify, options) {
  fastify.post('/api/order/dine-in', async (request, reply) => {
    try {
      let phone = null;
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const userSession = getUserByToken(token);
        if (userSession) {
          phone = userSession.phone;
        }
      }

      const { tableNumber, tableSign, items, comment, phone: bodyPhone } = request.body || {};

      if (!verifyTableAccess(tableNumber, tableSign, request, reply)) {
        return;
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({ success: false, error: 'Корзина пуста.' });
      }

      const orderData = {
        tableNumber: String(tableNumber).trim(),
        items,
        comment: comment || '',
        phone: phone || bodyPhone || null,
      };

      const orderInfo = await createDineInOrder(orderData, request.log);

      return reply.send({ success: true, order: orderInfo });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });

  // Получение текущего открытого счёта (чека) столика из iiko
  fastify.get('/api/order/table-bill', async (request, reply) => {
    try {
      const { table, sign } = request.query || {};
      if (!verifyTableAccess(table, sign, request, reply)) {
        return;
      }

      const result = await getTableBill(String(table).trim(), request.log);
      return reply.send({ success: true, ...result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Оплата счёта гостем (СБП / Карта онлайн) или вызов официанта (доп.)
  fastify.post('/api/order/pay', async (request, reply) => {
    try {
      const { tableNumber, tableSign, paymentMethod = 'sbp', tipAmount = 0 } = request.body || {};
      if (!verifyTableAccess(tableNumber, tableSign, request, reply)) {
        return;
      }

      const result = await payTableBill(
        {
          tableNumber: String(tableNumber).trim(),
          paymentMethod,
          tipAmount,
        },
        request.log
      );

      return reply.send({ success: true, ...result });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });
}