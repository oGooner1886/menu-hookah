import { sendSms, verifySms } from '../services/auth.service.js';
export default async function authRoutes(fastify, options) {
  fastify.post('/api/auth/send-sms', async (request, reply) => {
    try {
      const { phone } = request.body;
      if (!phone) {
        return reply.status(400).send({ success: false, error: 'UKAZHITE NOMER TELEFONA' });
      }
      const result = await sendSms(phone, request.log);
      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'VNUTRENNYA OSHIBKA SERVERA' });
    }
  });

  fastify.post('/api/auth/verify-sms', async (request, reply) => {
    try {
      const { phone, code } = request.body;
      if (!phone || !code) {
        return reply.status(400).send({ success: false, error: 'UKAZHITE NOMER TELEFONA I KOD' });
      }
      const result = await verifySms(phone, String(code), request.log);
      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'VNUTRENNYA OSHIBKA SERVERA' });
    }
  });
}
