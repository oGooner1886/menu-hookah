import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
const fastify = Fastify({
  logger: true,
  bodyLimit: 1048576,
});

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

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

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server запущен на http://localhost:${port}`);
    console.log(`Проверить статус и память можно на -> http://localhost:${port}/api/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
