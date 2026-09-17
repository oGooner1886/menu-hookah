import { createDineInOrder } from '../services/order.service.js';
import { getUserByToken } from '../services/auth.service.js'; 

export default async function orderRoutes(fastify, options) {
  fastify.post('/api/order/dine-in', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({ success: false, error: 'Trebuetsya avtorizatsiya. please voidite v sistemu.' });
      }

      const token = authHeader.split(' ')[1];

      const userSession = getUserByToken(token);
      if (!userSession) {
        return reply.status(401).send({ success: false, error: 'Sesiya ustarela ili nedeistvitelna. Voidite zanovo.' });
      }

      const { tableNumber, items, comment } = request.body;

      if (!tableNumber) {
        return reply.status(400).send({ success: false, error: 'Ne ukazan nomer stola.' });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({ success: false, error: 'Korzina pusta.' });
      }

      const orderData = {
        tableNumber,
        items,
        comment,
        phone: userSession.phone
      };

      const orderInfo = await createDineInOrder(orderData, request.log);
      
      return reply.send({ success: true, order: orderInfo });

    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });
}