const smsStore = new Map();

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
    console.log(`[ОЧИСТКА ПАМЯТИ] UDALENO ${deletedCount} PROSROCHENNYH SMS-codov`);
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

  return {
    success: true,
    token: `mock-jwt-token-for-${phone}`,
  };
}
