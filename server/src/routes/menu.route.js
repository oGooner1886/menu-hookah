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
}
