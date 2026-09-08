export default async function healthRoutes(fastify, options) {
  fastify.get('/api/health', async (request, reply) => {
    const memoryUsage = process.memoryUsage();

    return reply.send({
      status: 'ok',
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      },
    });
  });
}
