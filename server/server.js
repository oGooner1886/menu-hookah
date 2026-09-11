import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

import healthRoutes from './src/routes/health.route.js';
import menuRoutes from './src/routes/menu.route.js';

const fastify = Fastify({
  logger: true,
  bodyLimit: 1048576,
});

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

await fastify.register(healthRoutes);
await fastify.register(menuRoutes);

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server запущен на http://localhost:${port}`);
    console.log(`Проверить статус и память можно на -> http://localhost:${port}/api/health`);
    console.log(`Проверить загрузку меню можно на -> http://localhost:${port}/api/menu`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
