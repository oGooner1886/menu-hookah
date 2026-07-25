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

/**
 * * Получение токена авторизации iiko
 * * Токен кэшируется в памяти на 55 минут (айка выдает его на час)
 */

let iikoToken = { token: null, expiresAt: 0 };
let menuCache = { data: null, expiresAt: 0 };

async function getIikoToken() {
  const now = Date.now();
  if (iikoToken.token && now < iikoToken.expiresAt) {
    return iikoToken.token;
  }
  const response = await fetch('https://api-ru.iiko.services/api/v2/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiLogin: process.env.IIKO_API_KEY,
      clientSecret: process.env.IIKO_CLIENT_SECRET_GUSTO,
      appId: process.env.IIKO_APP_ID_GUSTO,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка получения токена iiko. Проверь значения body');
  }
  const data = await response.json();

  iikoToken = {
    token: data.token || data.access_token,
    expiresAt: now + 55 * 60 * 1000,
  };

  fastify.log.info('Получен новый токен iikoCloud');
  return iikoToken.token;
}

