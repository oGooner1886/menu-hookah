import { fetchMenuFromIiko, fetchStopListFromIiko } from '../services/iiko.service.js';
import { transformMenu } from '../services/menu.transformer.js';

export default async function menuRoutes(fastify, options) {
  fastify.get('/api/menu', async (request, reply) => {
    try {
      const rawMenu = await fetchMenuFromIiko(request.log);
      const categories = transformMenu(rawMenu);
      request.log.info(`Меню трансформировано: ${categories.length} категорий`);
      return reply.send({ success: true, categories });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/menu/stop-list', async (request, reply) => {
    try {
      const stopListIds = await fetchStopListFromIiko(request.log)
      return reply.send({ success: true, stopList: stopListIds })
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ success: false, error: 'Ne udalos` poluchit` stop-list' })
    }
  })
}
