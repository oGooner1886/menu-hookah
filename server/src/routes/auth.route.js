import { sendSms, verifySms } from '../services/auth.service.js';
import { checkRateLimit } from '../services/security.service.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/api/auth/send-sms', async (request, reply) => {
    try {
      const { phone } = request.body;
      if (!phone) {
        return reply.status(400).send({ success: false, error: 'UKAZHITE NOMER TELEFONA' });
      }

      const clientIp = request.ip;

      const rateLimit = checkRateLimit(clientIp, phone);

      if (!rateLimit.allowed) {
        request.log.warn(`[SPAM BLOCKED] ZABLOKIROVAN ZAPROS s IP: ${clientIp} na NOMER ${phone}`);
        return reply.status(429).send({ success: false, error: rateLimit.error });
      }

      const result = await sendSms(phone, request.log);

      if (!result.success) {
        return reply.status(400).send(result);
      }

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'VNUTRENNYA OSHIBKA SERVERA' });
    }
  });

  fastify.post('/api/auth/verify-sms', async (request, reply) => {
    // ... этот эндпоинт остается без изменений ...
    try {
      const { phone, code } = request.body;
      if (!phone || !code) {
        return reply.status(400).send({ success: false, error: 'UKAZHITE NOMER TELEFONA I KOD' });
      }

      const result = await verifySms(phone, String(code), request.log);

      if (!result.success) {
        return reply.status(400).send(result);
      }

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'VNUTRENNYA OSHIBKA SERVERA' });
    }
  });
}
