import crypto from 'crypto';
import {
  getLoyaltyProfileByPhone,
  createOrUpdateIikoCustomer,
  normalizePhone,
} from './loyalty.service.js';

const smsStore = new Map();
const sessionCache = new Map();

const SMS_TTL = 3 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  let deletedCount = 0;
  for (const [phone, data] of smsStore.entries()) {
    if (now > data.expiresAt) {
      smsStore.delete(phone);
      deletedCount++;
    }
  }
  if (deletedCount > 0) {
    console.log(`[OCHISTKA PAMYATI] UDALENO ${deletedCount} PROSROCHENNYH SMS-codov`);
  }
}, 60 * 1000);

export async function sendSms(rawPhone, logger) {
  const phone = normalizePhone(rawPhone);
  if (!phone || phone.length < 11) {
    return { success: false, error: 'Некорректный формат номера телефона' };
  }

  const code = Math.floor(1000 + Math.random() * 9000).toString();

  smsStore.set(phone, {
    code,
    expiresAt: Date.now() + SMS_TTL,
    attempts: 0,
  });

  logger.info(`[SMS MOCK] OTPRAVLEN COD ${code} NA NOMER ${phone}`);
  return {
    success: true,
    phone,
    devCode: code,
    message: `Код отправлен на номер ${phone}`,
  };
}

export async function verifySms(rawPhone, code, logger) {
  const phone = normalizePhone(rawPhone);
  const record = smsStore.get(phone);

  if (!record) {
    return { success: false, error: 'Код не найден или время его действия истекло.' };
  }

  if (Date.now() > record.expiresAt) {
    smsStore.delete(phone);
    return { success: false, error: 'Время действия кода истекло (прошло более 3 минут).' };
  }

  if (record.attempts >= 3) {
    smsStore.delete(phone);
    return { success: false, error: 'Слишком много неверных попыток. Запросите новый код.' };
  }

  if (record.code !== String(code).trim()) {
    record.attempts++;
    return { success: false, error: 'Неверный код из SMS.' };
  }

  smsStore.delete(phone);
  logger.info(`[SMS SUCCESS] NOMER ${phone} USPESHNO PODTVERZHDEN.`);

  // Подтягиваем реальный профиль лояльности гостя из iikoCloud (или создаём нового с 10%)
  const loyalty = await getLoyaltyProfileByPhone(phone, null, logger);

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const userObj = {
    phone: loyalty.phone || phone,
    name: loyalty.name || 'Гость',
    surname: loyalty.surname || '',
    fullName: loyalty.fullName || loyalty.name || 'Гость',
    birthday: loyalty.birthday || null,
    guestId: loyalty.guestId || null,
    authMethod: 'sms',
    createdAt: Date.now(),
  };

  sessionCache.set(sessionToken, userObj);

  return {
    success: true,
    token: sessionToken,
    user: userObj,
    loyalty,
  };
}

export async function loginWithYandex(yandexToken, logger) {
  logger.info('PROVERKA TOKENA CHEREZ YANDEX API');

  const response = await fetch('https://login.yandex.ru/info?format=json', {
    method: 'GET',
    headers: {
      Authorization: `OAuth ${yandexToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Недействительный токен Яндекс ID');
  }

  const yandexUser = await response.json();

  const rawPhone = yandexUser.default_phone ? yandexUser.default_phone.number : null;
  const name = yandexUser.first_name || yandexUser.real_name || 'Гость';
  const surname = yandexUser.last_name || '';
  const yandexId = yandexUser.id;

  if (!rawPhone) {
    throw new Error('В профиле Яндекс не указан номер телефона. Он нужен для бонусной карты.');
  }

  const phone = normalizePhone(rawPhone);
  const loyalty = await getLoyaltyProfileByPhone(phone, name, logger);

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const userObj = {
    yandexId,
    phone: loyalty.phone || phone,
    name: loyalty.name && loyalty.name !== 'Гость' ? loyalty.name : name,
    surname: loyalty.surname || surname,
    fullName: loyalty.fullName || [name, surname].filter(Boolean).join(' '),
    birthday: loyalty.birthday || yandexUser.birthday || null,
    guestId: loyalty.guestId || null,
    authMethod: 'yandex',
    createdAt: Date.now(),
  };

  sessionCache.set(sessionToken, userObj);

  logger.info(`Uspeshnaya auth (yandex): ${userObj.fullName}, ${phone}`);

  return {
    token: sessionToken,
    user: userObj,
    loyalty,
  };
}

export async function updateCustomerProfile(token, profileData, logger) {
  const session = sessionCache.get(token);
  const phone = normalizePhone(profileData.phone || session?.phone);
  if (!phone) {
    throw new Error('Необходимо авторизоваться по номеру телефона');
  }

  await createOrUpdateIikoCustomer(
    {
      phone,
      name: profileData.name,
      surname: profileData.surname,
      birthday: profileData.birthday,
    },
    logger
  );

  const loyalty = await getLoyaltyProfileByPhone(phone, profileData.name, logger);

  if (session) {
    session.name = loyalty.name;
    session.surname = loyalty.surname;
    session.fullName = loyalty.fullName;
    session.birthday = loyalty.birthday;
    sessionCache.set(token, session);
  }

  return {
    user: session || {
      phone: loyalty.phone,
      name: loyalty.name,
      surname: loyalty.surname,
      fullName: loyalty.fullName,
      birthday: loyalty.birthday,
    },
    loyalty,
  };
}

export function getUserByToken(token) {
  return sessionCache.get(token) || null;
}
