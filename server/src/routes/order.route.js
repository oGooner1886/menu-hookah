import { createDineInOrder } from '../services/order.service.js';
import { getUserByToken } from '../services/auth.service.js'; 
import { isValidTableSign } from '../services/security.service.js';

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

      if (!tableNumber) {
        return reply.status(400).send({ success: false, error: 'Не указан номер стола.' });
      }

      // Строгая проверка криптографической подписи стола из QR-кода
      if (process.env.ALLOW_UNSIGNED_TABLE !== 'true') {
        if (!tableSign || !isValidTableSign(tableNumber, tableSign)) {
          request.log.warn(`[SECURITY] Попытка заказа на стол №${tableNumber} без валидной подписи QR: "${tableSign}"`);
          return reply.status(403).send({
            success: false,
            error: 'Недействительная или отсутствующая подпись столика. Пожалуйста, отсканируйте QR-код на вашем столе заново.',
          });
        }
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
}