import { getIikoToken } from './iiko.service.js';

const IIKO_BASE_URL = 'https://api-ru.iiko.services';
const DEFAULT_WALLET_ID = '6d390000-a515-ba26-f0bd-08df24516051';

// Реальные уровни бонусной программы Gusto Lounge в iikoCloud
export const LOYALTY_TIERS = [
  {
    id: '87e3b06e-bdde-48a5-98c8-195183e38acb',
    percent: 10,
    name: '10%',
    title: 'Gusto Friend',
    threshold: 0,
    description: 'Стартовый уровень для каждого гостя с первой регистрации',
  },
  {
    id: '70c65573-bfdd-4c0b-bcb8-0df87b461854',
    percent: 15,
    name: '15%',
    title: 'Gusto Regular',
    threshold: 85000,
    description: 'Повышенный кешбэк 15% при сумме заказов от 85 000 ₽',
  },
  {
    id: '8f640938-3ba7-4714-8759-8cd691750f69',
    percent: 20,
    name: '20%',
    title: 'Gusto Resident',
    threshold: 115000,
    description: 'Максимальный VIP-кешбэк 20% при сумме заказов от 115 000 ₽',
  },
];

/**
 * Приведение любого российского номера к формату +7XXXXXXXXXX для iikoCloud
 */
export function normalizePhone(rawPhone) {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10 && digits.startsWith('9')) {
    return `+7${digits}`;
  }
  return `+${digits}`;
}

/**
 * Запрос информации о госте из iikoLoyalty по номеру телефона
 */
async function fetchIikoCustomerByPhone(phone, orgId, token) {
  const response = await fetch(`${IIKO_BASE_URL}/api/1/loyalty/iiko/customer/info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      organizationId: orgId,
      type: 'phone',
      phone,
    }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

/**
 * Создание или обновление гостя в iikoLoyalty
 */
export async function createOrUpdateIikoCustomer({ phone, name, surname, birthday }, logger) {
  const normalizedPhone = normalizePhone(phone);
  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();
  const token = await getIikoToken(logger);

  const payload = {
    organizationId: cleanOrgId,
    phone: normalizedPhone,
    shouldReceivePromoActionsInfo: true,
    shouldReceiveLoyaltyInfo: true,
  };

  if (name && name !== 'Guest') payload.name = String(name).trim();
  if (surname) payload.surname = String(surname).trim();
  if (birthday) {
    // Формат для iiko: "1999-07-31 00:00:00.000"
    const cleanDate = String(birthday).slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
      payload.birthday = `${cleanDate} 00:00:00.000`;
    }
  }

  const response = await fetch(`${IIKO_BASE_URL}/api/1/loyalty/iiko/customer/create_or_update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    logger?.warn?.(`[iikoLoyalty] Oshibka create_or_update: ${errText}`);
    throw new Error('Не удалось обновить профиль гостя в системе лояльности');
  }

  return response.json();
}

/**
 * Запрос счетчиков гостя (общая сумма заказов и число визитов за все время)
 */
async function fetchGuestCounters(guestId, orgId, token) {
  try {
    const response = await fetch(`${IIKO_BASE_URL}/api/1/loyalty/iiko/get_counters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organizationId: orgId,
        guestIds: [guestId],
        periods: [4], // Period 4 = За всё время (используется в условиях Бонусной программы iiko)
        metrics: [1, 2], // 1 = OrdersSum, 2 = OrdersCount
      }),
    });

    if (!response.ok) return { totalSpent: 0, ordersCount: 0 };

    const data = await response.json();
    const counters = Array.isArray(data?.counters) ? data.counters : [];
    const sumCounter = counters.find((c) => c.metric === 1);
    const countCounter = counters.find((c) => c.metric === 2);

    return {
      totalSpent: Math.round(Number(sumCounter?.value || 0)),
      ordersCount: Math.round(Number(countCounter?.value || 0)),
    };
  } catch {
    return { totalSpent: 0, ordersCount: 0 };
  }
}

/**
 * Сборка полного профиля лояльности гостя для Личного Кабинета
 */
export async function getLoyaltyProfileByPhone(rawPhone, fallbackName = null, logger = console) {
  const phone = normalizePhone(rawPhone);
  if (!phone || phone.length < 11) {
    throw new Error('Некорректный номер телефона');
  }

  const cleanOrgId = (process.env.IIKO_ORGANIZATION_GUSTO_ID || '').trim();
  const token = await getIikoToken(logger);

  let customer = await fetchIikoCustomerByPhone(phone, cleanOrgId, token);

  // Если гостя ещё нет в iiko — регистрируем его автоматически (получит стартовые 10%)
  if (!customer) {
    logger?.info?.(`[iikoLoyalty] Гость ${phone} не найден в iiko, регистрируем нового участника...`);
    try {
      await createOrUpdateIikoCustomer(
        {
          phone,
          name: fallbackName && fallbackName !== 'Guest' ? fallbackName : 'Гость Gusto',
        },
        logger
      );
      customer = await fetchIikoCustomerByPhone(phone, cleanOrgId, token);
    } catch (err) {
      logger?.warn?.(`[iikoLoyalty] Не удалось авто-создать гостя: ${err.message}`);
    }
  }

  // Если iiko вернул данные гостя
  if (customer && customer.id) {
    const counters = await fetchGuestCounters(customer.id, cleanOrgId, token);

    // Определяем баланс бонусного кошелька
    const wallets = Array.isArray(customer.walletBalances) ? customer.walletBalances : [];
    const bonusWallet =
      wallets.find((w) => w.id === DEFAULT_WALLET_ID) ||
      wallets.find((w) => w.type === 1) ||
      wallets[0];
    const balance = Math.round(Number(bonusWallet?.balance || 0));

    // Определяем текущую категорию кешбэка (10%, 15% или 20%)
    const guestCats = Array.isArray(customer.categories) ? customer.categories : [];
    let activeTier = LOYALTY_TIERS[0];

    for (const tier of LOYALTY_TIERS) {
      const matched = guestCats.some(
        (c) => c.id === tier.id || String(c.name).includes(String(tier.percent))
      );
      if (matched) {
        activeTier = tier;
      }
    }

    // Если по сумме заказов гость уже перешагнул порог, учитываем это
    const currentIndex = LOYALTY_TIERS.findIndex((t) => t.percent === activeTier.percent);
    const nextTier =
      currentIndex >= 0 && currentIndex < LOYALTY_TIERS.length - 1
        ? LOYALTY_TIERS[currentIndex + 1]
        : null;

    const totalSpent = counters.totalSpent;
    let progressPercent = 100;
    let remainingToNextTier = 0;

    if (nextTier) {
      const prevThreshold = activeTier.threshold;
      const span = Math.max(1, nextTier.threshold - prevThreshold);
      const progressed = Math.max(0, totalSpent - prevThreshold);
      progressPercent = Math.min(100, Math.round((progressed / span) * 100));
      remainingToNextTier = Math.max(0, nextTier.threshold - totalSpent);
    }

    const firstName = customer.name || fallbackName || 'Гость';
    const surname = customer.surname || '';
    const fullName = [firstName, surname].filter(Boolean).join(' ').trim();

    return {
      guestId: customer.id,
      phone: customer.phone || phone,
      name: firstName,
      surname,
      fullName,
      birthday: customer.birthday ? String(customer.birthday).slice(0, 10) : null,
      whenRegistered: customer.whenRegistered || null,
      lastOrderDate: customer.lastProcessedOrderDate || null,
      balance,
      walletName: bonusWallet?.name || 'Бонусная программа',
      cashbackPercent: activeTier.percent,
      tierTitle: activeTier.title,
      tierName: activeTier.name,
      totalSpent,
      ordersCount: counters.ordersCount,
      nextTier: nextTier
        ? {
            percent: nextTier.percent,
            title: nextTier.title,
            threshold: nextTier.threshold,
            remaining: remainingToNextTier,
            progressPercent,
          }
        : null,
      tiers: LOYALTY_TIERS,
    };
  }

  // Fallback, если iiko временно не ответил
  return {
    guestId: null,
    phone,
    name: fallbackName || 'Гость',
    surname: '',
    fullName: fallbackName || 'Гость',
    birthday: null,
    balance: 0,
    walletName: 'Бонусная программа',
    cashbackPercent: 10,
    tierTitle: 'Gusto Friend',
    tierName: '10%',
    totalSpent: 0,
    ordersCount: 0,
    nextTier: {
      percent: 15,
      title: 'Gusto Regular',
      threshold: 85000,
      remaining: 85000,
      progressPercent: 0,
    },
    tiers: LOYALTY_TIERS,
  };
}
