import {
  sendSms,
  verifySms,
  loginWithYandex,
  getUserByToken,
  updateCustomerProfile,
} from '../services/auth.service.js';
import { getLoyaltyProfileByPhone } from '../services/loyalty.service.js';
import { checkRateLimit } from '../services/security.service.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/api/auth/send-sms', async (request, reply) => {
    try {
      const { phone } = request.body || {};
      if (!phone) {
        return reply.status(400).send({ success: false, error: 'Укажите номер телефона' });
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
      return reply.status(500).send({ success: false, error: 'Внутренняя ошибка сервера' });
    }
  });

  fastify.post('/api/auth/verify-sms', async (request, reply) => {
    try {
      const { phone, code } = request.body || {};
      if (!phone || !code) {
        return reply.status(400).send({ success: false, error: 'Укажите номер телефона и код' });
      }

      const result = await verifySms(phone, String(code), request.log);

      if (!result.success) {
        return reply.status(400).send(result);
      }

      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: 'Внутренняя ошибка сервера' });
    }
  });

  fastify.post('/api/auth/yandex/', async (request, reply) => {
    try {
      const { yandexToken } = request.body || {};

      if (!yandexToken) {
        return reply.status(400).send({ success: false, error: 'Укажите токен Яндекса' });
      }

      const result = await loginWithYandex(yandexToken, request.log);

      return reply.send({ success: true, ...result });
    } catch (error) {
      request.log.error(error);
      return reply.status(401).send({ success: false, error: error.message });
    }
  });

  // Получение актуального баланса и статуса лояльности гостя из iikoCloud
  fastify.get('/api/auth/loyalty', async (request, reply) => {
    try {
      let phone = request.query?.phone || null;
      let fallbackName = null;

      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const sessionUser = getUserByToken(token);
        if (sessionUser) {
          phone = sessionUser.phone || phone;
          fallbackName = sessionUser.name || null;
        }
      }

      if (!phone) {
        return reply.status(401).send({
          success: false,
          error: 'Необходимо войти в личный кабинет по номеру телефона',
        });
      }

      const loyalty = await getLoyaltyProfileByPhone(phone, fallbackName, request.log);
      return reply.send({ success: true, loyalty });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });

  // Обновление анкеты гостя (Имя, Фамилия, Дата рождения) в iikoCloud
  fastify.post('/api/auth/profile', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      const token =
        authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

      const { phone, name, surname, birthday } = request.body || {};
      const result = await updateCustomerProfile(
        token,
        { phone, name, surname, birthday },
        request.log
      );

      return reply.send({ success: true, ...result });
    } catch (error) {
      request.log.error(error);
      return reply.status(400).send({ success: false, error: error.message });
    }
  });
}
