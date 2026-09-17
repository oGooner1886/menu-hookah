let iikoToken = { token: null, expiresAt: 0 };
let menuCache = { data: null, expiresAt: 0 };
let stopListCache = { data: [], expiresAt: 0 };

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
    throw new Error('Oshibka polucheniya tokena iiko. Prover` znacheniya body');
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
    throw new Error(`Oshibka zagruzki menu: ${listResponse.status} - ${errorBody}`);
  }
  const listData = await listResponse.json();

  if (!listData.externalMenus || listData.externalMenus.length === 0) {
    throw new Error('v iikoWeb ne naideno ni odnogo vneshnego menu.');
  }
  const externalMenuId = listData.externalMenus[0].id;

  const menuName = listData.externalMenus[0].name;

  logger.info(`Zagruzhaem menu: ${menuName} (id: ${externalMenuId})`);

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
    throw new Error(`Oshibka zagruzki menu po id: ${menuResponse.status} - ${errorBody}`);
  }

  const data = await menuResponse.json();

  menuCache = {
    data: data,
    expiresAt: now + 15 * 60 * 1000,
  };

  logger.info('MENU gusto zagruzheno i cach');
  return menuCache.data;
}

export async function fetchStopListFromIiko(logger) {
  const now = Date.now();

  if (stopListCache.data.length > 0 && now < stopListCache.expiresAt) {
    return stopListCache.data;
  }

  const token = await getIikoToken(logger);
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();

  try {
    const response = await fetch('https://api-ru.iiko.services/api/1/stop_lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ organizationIds: [cleanOrgId] })
    });

    if (!response.ok) {
      throw new Error(`Ошибка iiko: ${response.status}`);
    }

    const data = await response.json();
        // console.log(" RAW OTVET IIKO STOP-LIST:", JSON.stringify(data, null, 2));
    const outOfStockIds = [];

    if (data.terminalGroupStopLists) {
      data.terminalGroupStopLists.forEach(orgGroup => {
        if (orgGroup.items) {
          orgGroup.items.forEach(termGroup => {
            if (termGroup.items) {
              termGroup.items.forEach(item => {
                if (item.balance <= 0) {
                  outOfStockIds.push(item.productId);
                }
              });
            }
          });
        }
      });
    }
    stopListCache = {
      data: [...new Set(outOfStockIds)],
      expiresAt: now + 60 * 1000,
    };
    logger.info(`Stop-list update. V  stope-tovarov: ${stopListCache.data.length}`);
    return stopListCache.data;
  } catch (error) {
    logger.error(` Oshibka zagruzki stop-lista: ${error.message}`);
    return [];
  }
}
