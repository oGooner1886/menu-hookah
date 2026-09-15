import { createDineInOrder } from '../services/order.service.js';

export default async function orderRoutes(fastify, options) {
  fastify.post('/api/order/dine-in', async (request, reply) => {
    try {
      const { tableNumber, items } = request.body;
      if (!tableNumber) {
        return reply.status(400).send({ success: false, error: `Ne ukazan nomer stola` });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return reply.status(400).send({ success: false, error: `Korzina pustaya` });
      }
      const orderInfo = await createDineInOrder(request.body, request.log);
      return reply.send({ success: true, order: orderInfo });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });
}
