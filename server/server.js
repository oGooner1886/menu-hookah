
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

/**
 * * Загрузка и агрегация меню из айки
 * * Меню кэшируется в памяти на 15 минут
 */

async function fetchMenuFromIiko() {
  const now = Date.now();

  if (menuCache.data && now < menuCache.expiresAt) {
    return menuCache.data;
  }
  const token = await getIikoToken();

  const orgIds = [process.env.IIKO_ORGANIZATION_GUSTO_ID].filter(Boolean);

  if (orgIds.length === 0) {
    throw new Error('не указан id организации');
  }
  fastify.log.info(`Запрашиваем меню для организации: ${orgIds[0]}`);

  const listResponse = await fetch('https://api-ru.iiko.services/api/2/menu', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  if (!listResponse.ok) {
    const errorBody = await listResponse.text();
    throw new Error(`Ошибка загрузки меню: ${listResponse.status} - ${errorBody}`);
  }
  const listData = await listResponse.json();
  if (!listData.externalMenus || listData.externalMenus.length === 0) {
    throw new Error('в iikoWeb не найдено ни одного внешнего меню.');
  }
  const externalMenuId = listData.externalMenus[0].id;

  const menuName = listData.externalMenus[0].name;
  fastify.log.info(`Загружаем меню: ${menuName} (id: ${externalMenuId})`);

  const menuResponse = await fetch('https://api-ru.iiko.services/api/2/menu/by_id', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      externalMenuId: externalMenuId,
      organizationIds: orgIds,
    }),
  });

  if (!menuResponse.ok) {
    const errorBody = await menuResponse.text();
    throw new Error(`Ошибка загрузки меню по id: ${menuResponse.status} - ${errorBody}`);
  }
  const data = await menuResponse.json();
  menuCache = {
    data: data,
    expiresAt: now + 15 * 60 * 1000,
  };
  fastify.log.info('Меню gusto загружено и закэшено');
  return menuCache.data;
}


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
