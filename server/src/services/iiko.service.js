let iikoToken = { token: null, expiresAt: 0 };
let menuCache = { data: null, expiresAt: 0 };

export async function getIikoToken(logger) {
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

  logger.info('Polushen noviy token iikoCloud');
  return iikoToken.token;
}

export async function fetchMenuFromIiko(logger) {
  const now = Date.now();

  if (menuCache.data && now < menuCache.expiresAt) {
    return menuCache.data;
  }
  const token = await getIikoToken(logger);

  const orgIds = process.env.IIKO_ORGANIZATION_GUSTO_ID;

  if (orgIds.length === 0) {
    throw new Error('не указан id организации');
  }
  logger.info(`Запрашиваем меню для организации: ${orgIds[0]}`);

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

  logger.info(`Загружаем меню: ${menuName} (id: ${externalMenuId})`);

  const menuResponse = await fetch('https://api-ru.iiko.services/api/menu/v3/by_id', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      externalMenuId: String(externalMenuId),
      organizationId: orgIds,
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

  logger.info('Меню gusto загружено и закэшено');
  return menuCache.data;
}
