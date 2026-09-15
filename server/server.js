import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import healthRoutes from './src/routes/health.route.js';
import menuRoutes from './src/routes/menu.route.js';
import authRoutes from './src/routes/auth.route.js';
import { loadTablesCache } from './src/services/table.service.js';
import orderRoutes from './src/routes/order.route.js';

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        tranlateTime: 'HH:MM:ss Z',
        ignore: 'pid, hostname',
        colorize: true,
      },
    },
  },
  bodyLimit: 1048576,
  trustProxy: true,
});

await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
});

await fastify.register(healthRoutes);
await fastify.register(menuRoutes);
await fastify.register(authRoutes);
await fastify.register(orderRoutes);

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await loadTablesCache(fastify.log);
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server zapushen na http://localhost:${port}`);
    console.log(`Proverit' status i pamyat' mozhno na -> http://localhost:${port}/api/health`);
    console.log(`Proverit' zagruzku menu moznho na -> http://localhost:${port}/api/menu`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
