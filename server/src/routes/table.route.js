import {
  getAvailableTables,
  getTableInfo,
  isTableValid,
  getTablesWorkload,
  createTableReservation,
} from '../services/table.service.js';

export default async function tableRoutes(fastify, options) {
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


