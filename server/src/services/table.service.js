//TODO сделать сервис для столов, представлять в виде квери параметра, добавить в кэш.
//! ключ - номер стола, значение - объект { tableId: "uuid..." }
import { getIikoToken } from './iiko.service.js';
const tablesCache = new Map();
const tableIdToNumber = new Map();
let sectionIds = [];

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
    tableIdToNumber.clear();
    sectionIds = [];
    let loadedCount = 0;

    tablesData.restaurantSections.forEach((section) => {
      sectionIds.push(section.id);
      section.tables.forEach((table) => {
        tablesCache.set(String(table.number), {
          tableId: table.id,
          terminalGroupId: mainTerminalGroupId,
          tableName: table.name || `Стол ${table.number}`,
          sectionName: section.name,
          sectionId: section.id,
        });
        tableIdToNumber.set(table.id, String(table.number));
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

export function getAvailableTables() {
  const result = [];
  for (const [number, data] of tablesCache.entries()) {
    result.push({
      number,
      tableName: data.tableName,
      sectionName: data.sectionName,
    });
  }
  return result.sort((a, b) => {
    const na = parseInt(a.number, 10);
    const nb = parseInt(b.number, 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.number.localeCompare(b.number, 'ru');
  });
}

export function isTableValid(tableNumber) {
  if (!tableNumber) return false;
  if (tablesCache.size === 0) return true;
  return tablesCache.has(String(tableNumber));
}

/**
 * Получение занятых столов из iikoCloud на выбранную дату и время
 */
export async function getTablesWorkload(date, time, logger) {
  const token = await getIikoToken(logger);

  if (sectionIds.length === 0) {
    await loadTablesCache(logger);
  }

  const queryDate = date || new Date().toISOString().slice(0, 10);
  const dateFrom = `${queryDate} 00:00:00.000`;
  const dateTo = `${queryDate} 23:59:59.000`;

  try {
    const response = await fetch('https://api-ru.iiko.services/api/1/reserve/restaurant_sections_workload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        restaurantSectionIds: sectionIds,
        dateFrom,
        dateTo,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.warn(`[iiko workload] Warning ${response.status}: ${errText}`);
      return { occupiedTables: [] };
    }

    const data = await response.json();
    const reserves = data.reserves || [];

    // Преобразуем выбранное время в timestamp
    const [targetH, targetM] = (time || '18:00').split(':').map(Number);
    const targetDate = new Date(`${queryDate}T${String(targetH).padStart(2, '0')}:${String(targetM).padStart(2, '0')}:00`);
    const targetTimeMs = targetDate.getTime();

    const occupiedNumbers = new Set();

    reserves.forEach((r) => {
      if (r.status === 'Cancelled' || r.status === 'Deleted') return;

      const startTime = new Date(r.estimatedStartTime.replace(' ', 'T')).getTime();
      const durationMs = (r.durationInMinutes || 120) * 60 * 1000;
      const endTime = startTime + durationMs;

      // Если выбранное время попадает в интервал брони стола
      if (targetTimeMs >= startTime && targetTimeMs < endTime) {
        (r.tableIds || []).forEach((id) => {
          const num = tableIdToNumber.get(id);
          if (num) occupiedNumbers.add(String(num));
        });
      }
    });

    return { occupiedTables: Array.from(occupiedNumbers) };
  } catch (error) {
    logger.error(`[iiko workload error] ${error.message}`);
    return { occupiedTables: [] };
  }
}

/**
 * Создание бронирования стола в iikoCloud
 */
export async function createTableReservation(reserveData, logger) {
  const token = await getIikoToken(logger);
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();

  const { tableNumber, date, time, guests, name, phone, comment } = reserveData;
  const table = getTableInfo(tableNumber);

  const estimatedStartTime = `${date} ${time}:00.000`;

  const payload = {
    organizationId: cleanOrgId,
    terminalGroupId: table.terminalGroupId || mainTerminalGroupId,
    customer: {
      name: name || 'Гость',
      phone: phone || '',
    },
    order: {
      tableIds: [table.tableId],
      comment: comment || 'Бронь через QR-меню Restoplace',
    },
    estimatedStartTime,
    durationInMinutes: 120,
    guestsCount: Number(guests) || 2,
  };

  const response = await fetch('https://api-ru.iiko.services/api/1/reserve/create_reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    logger.error(`[iiko create_reservation error] ${errText}`);
    throw new Error('Не удалось создать бронь в iiko: ' + errText);
  }

  const result = await response.json();
  logger.info(`[iiko reserve success] ID: ${result.reserveInfo?.id || 'ok'}`);
  return result;
}


