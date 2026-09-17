import crypto from 'crypto';
const smsStore = new Map();
const sessionCache = new Map()

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

export async function sendSms(phone, logger) {
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  smsStore.set(phone, {
    code: code,
    expiresAt: Date.now() + SMS_TTL,
    attempts: 0,
  });
  logger.info(`[SMS MOCK] OTPRAVLEN COD ${code} NA NOMER ${phone}`);
  return { success: true, message: `COD OTPRAVLEN NA NOMER ${phone}` };
}

export async function verifySms(phone, code, logger) {
  const record = smsStore.get(phone);

  if (!record) {
    return {success: false, error: 'COD NE NAIDEN ILI VREMYA EGO DEISTVIYA ISTEKLO.'};
  }

  if (Date.now() > record.expiresAt) {
    smsStore.delete(phone);
    return {success: false, error: 'VREMYA DEISTVIYA CODA ISTEKLO. PROSHLO BOLSHE 3 MINUT'};
  }

  if (record.attempts >= 3) {
    smsStore.delete(phone);
    return {success: false, error: 'Slishkom mnogo nevernyh popitok. Zaprosite novyi kod.'};
  }

  if (record.code !== code) {
    record.attempts++;
    return {success: false, error: 'Nevernyi kod.'};
  }

  smsStore.delete(phone);

  logger.info(`[SMS SUCCESS] NOMER ${phone} USPESHNO PODTVERZHDEN.`);

  const sessionToken = crypto.randomBytes(32).toString('hex')

  sessionCache.set(sessionToken, {
    phone: phone,
    name: 'Guest',
    authMethod: 'sms',
    createdAt: Date.now()
  })

  return {
    success: true,
    token: sessionToken,
    user: { phone, name: 'Guest'}
  };
}

export async function loginWithYandex(yandexToken, logger){
  logger.info('PROVERKA TOKENA CHEREZ YANDEX API')

  const response = await fetch('https:/login.yandex.ru/info?format=json', {
    method: 'GET',
    headers: {
      Authorization: `OAuth ${yandexToken}`
    }
  })

  if(!response.ok){
    throw new Error('Nedeistvitel`niy token yandexa')
  }

  const yandexUser = await response.json()
  
  const phone = yandexUser.default_phone ? yandexUser.default_phone.number : null;
  const name = yandexUser.first_name || yandexUser.real_name || 'Guest';
  const yandexId = yandexUser.id;

  if(!phone){
    throw new Error('V profile ne ukazan nomer telefona. On nuzhen dlya zakaza')
  }

  const sessionToken = crypto.randomBytes(32).toString('hex')

  sessionCache.set(sessionToken, {
    yandexId,
    phone,
    name,
    authMethod: 'yandex',
    createdAt: Date.now()
  })

  logger.info(`Uspeshnaya auth (yandex): ${name}, ${phone}`)

  return {
    token: sessionToken,
    user: {name, phone}
  }
}

export function getUserByToken(token){
  return sessionCache.get(token) || null;
}