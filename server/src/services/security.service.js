const ipLimits = new Map();
const phoneLimits = new Map();

const COOLDOWN_MS = 60 * 1000; 

setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of ipLimits.entries()) {
    if (now - timestamp > COOLDOWN_MS) ipLimits.delete(ip);
  }
  for (const [phone, timestamp] of phoneLimits.entries()) {
    if (now - timestamp > COOLDOWN_MS) phoneLimits.delete(phone);
  }
}, 60 * 1000);

export function checkRateLimit(ip, phone) {
  const now = Date.now();
  
  const lastIpRequest = ipLimits.get(ip);
  const lastPhoneRequest = phoneLimits.get(phone);

  if (lastIpRequest && now - lastIpRequest < COOLDOWN_MS) {
    const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastIpRequest)) / 1000);
    return { 
      allowed: false, 
      error: `Слишком много запросов. Подождите ${timeLeft} сек.` 
    };
  }

  if (lastPhoneRequest && now - lastPhoneRequest < COOLDOWN_MS) {
    const timeLeft = Math.ceil((COOLDOWN_MS - (now - lastPhoneRequest)) / 1000);
    return { 
      allowed: false, 
      error: `SMS на этот номер уже отправлено. Подождите ${timeLeft} сек.` 
    };
  }

  ipLimits.set(ip, now);
  phoneLimits.set(phone, now);

  return { allowed: true };
}