import { fetchMenuFromIiko, fetchStopListFromIiko } from '../services/iiko.service.js';
export default async function menuRoutes(fastify, options) {
  fastify.get('/api/menu', async (request, reply) => {
    try {
      const menu = await fetchMenuFromIiko(request.log);
      return reply.send({ success: true, menu });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/menu/stop-list', async (request, reply) => {
    try {
      const stopListIds = await fetchStopListFromIiko(request.log)
      return reply.send({success: true, stopList: stopListIds})
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({success: false, error: 'Ne udalos` poluchit` stop-list'})
    }
  })
}
