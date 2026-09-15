//TODO сделать сервис для столов, представлять в виде квери параметра, добавить в кэш.
//! ключ - номер стола, значение - объект { tableId: "uuid..." }
import { getIikoToken } from './iiko.service.js';
const tablesCache = new Map();

//* id terminal
let mainTerminalGroupId = null;

export async function loadTablesCache(logger) {
  const token = await getIikoToken(logger);
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();

  logger.info('Nachinaem zagruzku stuktury zalov i stolov iz iikoCloud');

  try {
    const terminalResponse = await fetch('https://api-ru.iiko.services/api/1/terminal_groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organizationIds: [cleanOrgId],
      }),
    });
    const terminalData = await terminalResponse.json();
    if (!terminalData.terminalGroups || terminalData.terminalGroups.length === 0) {
      throw new Error('Terminali ne naideni v iiko');
    }

    mainTerminalGroupId = terminalData.terminalGroups[0].items[0].id;

    const tableResponse = await fetch('https://api-ru.iiko.services/api/1/reserve/available_restaurant_sections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        terminalGroupIds: [mainTerminalGroupId],
      }),
    });
    const tablesData = await tableResponse.json();

    tablesCache.clear();
    let loadedCount = 0;

    tablesData.restaurantSections.forEach((section) => {
      section.tables.forEach((table) => {
        tablesCache.set(String(table.number), {
          tableId: table.id,
          terminalGroupId: mainTerminalGroupId,
          tableName: table.name || `Стол ${table.number}`,
          sectionName: section.name,
        });
        loadedCount++;
      });
    });
    logger.info(`Uspeshno zagruzheno ${loadedCount} stol[a/ov] v kesh`);
  } catch (error) {
    logger.error(`Oshibka pri zagruzheno stol[a/ov] ${error.message}`);
  }
}

export function getTableInfo(tableNumber) {
  const table = tablesCache.get(String(tableNumber));
  if (!table) {
    throw new Error(`Stol №${tableNumber} ne naiden v zavedenii. Ubedites', shto otskanirovali pravilnyi QR-kod.`);
  }
  return table;
}
