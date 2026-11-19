import {
  getAvailableTables,
  getTableInfo,
  isTableValid,
  getTablesWorkload,
  createTableReservation,
  setTableLiveStatus,
  getLiveOccupiedTablesList,
  handleIikoWebhookEvent,
  registerIikoWebhookUri,
} from '../services/table.service.js';
import { generateTableSign } from '../services/security.service.js';

export default async function tableRoutes(fastify, options) {
  // Генерация подписанной ссылки для QR-кода столика
  fastify.get('/api/tables/qr-link', async (request, reply) => {
    try {
      const { table, branch = 'gusto' } = request.query || {};
      if (!table) {
        return reply.status(400).send({ success: false, error: 'Укажите номер стола: ?table=14' });
      }
      const sign = generateTableSign(table);
      const url = `/${branch}/menu?table=${table}&sign=${sign}`;
      return reply.send({ success: true, table: String(table), sign, url });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/tables', async (request, reply) => {
    try {
      const tables = getAvailableTables();
      return reply.send({ success: true, tables });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/tables/workload', async (request, reply) => {
    try {
      const { date, time } = request.query;
      const result = await getTablesWorkload(date, time, request.log);
      return reply.send({ success: true, ...result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message, occupiedTables: [] });
    }
  });

  // Управление живым статусом стола (для тестирования или ручного переключения персоналом)
  fastify.post('/api/tables/live-status', async (request, reply) => {
    try {
      const { tableNumber, isOccupied, details } = request.body || {};
      if (!tableNumber) {
        return reply.status(400).send({ success: false, error: 'Укажите tableNumber' });
      }
      setTableLiveStatus(tableNumber, !!isOccupied, details || {});
      request.log.info(`[LiveStatus] Table №${tableNumber} isOccupied=${!!isOccupied}`);
      return reply.send({
        success: true,
        tableNumber,
        isOccupied: !!isOccupied,
        liveOccupied: getLiveOccupiedTablesList(),
      });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/tables/live-occupied', async (request, reply) => {
    return reply.send({
      success: true,
      liveOccupied: getLiveOccupiedTablesList(),
    });
  });

  // Официальный эндпоинт Webhook для iikoCloud
  fastify.post('/api/iiko/webhook', async (request, reply) => {
    try {
      handleIikoWebhookEvent(request.body, request.log);
      return reply.send({ status: 'ok' });
    } catch (error) {
      request.log.error(`[Webhook error] ${error.message}`);
      return reply.status(200).send({ status: 'error_handled' });
    }
  });

  // Регистрация URL вебхука в iikoCloud
  fastify.post('/api/iiko/webhook/register', async (request, reply) => {
    try {
      const { webHooksUri } = request.body || {};
      if (!webHooksUri) {
        return reply.status(400).send({ success: false, error: 'Укажите webHooksUri' });
      }
      const result = await registerIikoWebhookUri(webHooksUri, request.log);
      return reply.send({ success: true, result });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  fastify.post('/api/tables/reserve', async (request, reply) => {
    try {
      const { tableNumber, date, time, guests, name, phone, comment } = request.body || {};
      if (!tableNumber || !date || !time) {
        return reply.status(400).send({ success: false, error: 'Укажите стол, дату и время' });
      }

      const result = await createTableReservation(
        { tableNumber, date, time, guests, name, phone, comment },
        request.log
      );
      return reply.send({ success: true, result });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/tables/:tableNumber', async (request, reply) => {
    try {
      const { tableNumber } = request.params;
      const table = getTableInfo(tableNumber);
      return reply.send({ success: true, table });
    } catch (error) {
      return reply.status(404).send({ success: false, error: error.message });
    }
  });

  fastify.get('/api/tables/validate/:tableNumber', async (request, reply) => {
    const { tableNumber } = request.params;
    const valid = isTableValid(tableNumber);
    return reply.send({ success: true, valid });
  });
}


