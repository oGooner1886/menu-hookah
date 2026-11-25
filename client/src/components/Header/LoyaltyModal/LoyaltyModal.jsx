import React, { useState, useEffect } from 'react';
import styles from './LoyaltyModal.module.css';
import { useStore } from '../../../store/useStore';
import logoGusto from '../../../assets/images/favicon.png';

const API_URL = 'http://localhost:3000/api';

// Форматирование ввода телефона в маску +7 (XXX) XXX-XX-XX
function formatPhoneInput(value) {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '+7 ';
  if (digits[0] === '8' || digits[0] === '7') {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);

  let result = '+7';
  if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 4) result += `) ${digits.slice(3, 6)}`;
  if (digits.length >= 7) result += `-${digits.slice(6, 8)}`;
  if (digits.length >= 9) result += `-${digits.slice(8, 10)}`;
  return result;
}

const LoyaltyModal = () => {
  const isOpen = useStore((state) => state.isLoyaltyModalOpen);
  const setLoyaltyModalOpen = useStore((state) => state.setLoyaltyModalOpen);
  const user = useStore((state) => state.user);
  const loyaltyProfile = useStore((state) => state.loyaltyProfile);
  const isLoyaltyLoading = useStore((state) => state.isLoyaltyLoading);
  const setAuth = useStore((state) => state.setAuth);
  const logout = useStore((state) => state.logout);
  const fetchLoyaltyProfile = useStore((state) => state.fetchLoyaltyProfile);
  const updateUserProfile = useStore((state) => state.updateUserProfile);

  // Шаги авторизации: 'phone' | 'code'
  const [authStep, setAuthStep] = useState('phone');
  const [phoneInput, setPhoneInput] = useState('+7 ');
  const [smsCode, setSmsCode] = useState('');
  const [devCodeHint, setDevCodeHint] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Внутренние состояния ЛК: показ QR карты для официанта и редактирование профиля
  const [showCardQr, setShowCardQr] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editBirthday, setEditBirthday] = useState('');
  const [profileSaveMsg, setProfileSaveMsg] = useState('');

  // При открытии модалки для авторизованного гостя обновляем баланс из iiko
  useEffect(() => {
    if (isOpen && (user?.phone || loyaltyProfile?.phone)) {
      fetchLoyaltyProfile();
    }
  }, [isOpen, user?.phone, loyaltyProfile?.phone, fetchLoyaltyProfile]);

  useEffect(() => {
    if (loyaltyProfile || user) {
      setEditName(loyaltyProfile?.name || user?.name || '');
      setEditSurname(loyaltyProfile?.surname || user?.surname || '');
      setEditBirthday(loyaltyProfile?.birthday || user?.birthday || '');
    }
  }, [loyaltyProfile, user]);

  if (!isOpen) return null;

  const handleClose = () => {
    setLoyaltyModalOpen(false);
    setAuthError('');
    setShowCardQr(false);
    setIsEditingProfile(false);
  };

  // Шаг 1: Отправка SMS-кода
  const handleSendSms = async (e, overrideRawPhone = null) => {
    if (e) e.preventDefault();
    setAuthError('');

    const raw = overrideRawPhone || phoneInput;
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 11) {
      setAuthError('Введите полный номер телефона');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/auth/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+${digits}` }),
      });
      const data = await res.json();
      if (data.success) {
        if (overrideRawPhone) {
          setPhoneInput(formatPhoneInput(overrideRawPhone));
        }
        setDevCodeHint(data.devCode || null);
        setSmsCode(data.devCode || '');
        setAuthStep('code');
      } else {
        setAuthError(data.error || 'Не удалось отправить SMS');
      }
    } catch {
      setAuthError('Ошибка соединения с сервером');
    } finally {
      setIsSending(false);
    }
  };

  // Шаг 2: Проверка SMS-кода и загрузка бонусного счёта из iiko
  const handleVerifySms = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');

    if (!smsCode || smsCode.trim().length < 4) {
      setAuthError('Введите 4-значный код из SMS');
      return;
    }

    const digits = phoneInput.replace(/\D/g, '');
    setIsSending(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+${digits}`,
          code: smsCode.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuth(data.token, data.user, data.loyalty);
        setAuthStep('phone');
        setSmsCode('');
        setDevCodeHint(null);
      } else {
        setAuthError(data.error || 'Неверный код');
      }
    } catch {
      setAuthError('Ошибка проверки кода');
    } finally {
      setIsSending(false);
    }
  };

  // Вход через Яндекс ID (OAuth popup или токен)
  const handleYandexAuth = () => {
    const clientId = import.meta.env.VITE_YANDEX_CLIENT_ID;
    if (clientId) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/yandex/callback`);
      window.location.href = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
    } else {
      // Если клиентский ID Яндекса ещё не прописан в .env — подсказываем быстрый вход по номеру
      setAuthError('Для Яндекс OAuth укажите VITE_YANDEX_CLIENT_ID или войдите по номеру телефона за 5 секунд.');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaveMsg('');
    try {
      await updateUserProfile({
        name: editName.trim(),
        surname: editSurname.trim(),
        birthday: editBirthday || null,
      });
      setIsEditingProfile(false);
      setProfileSaveMsg('Данные сохранены в iiko');
      setTimeout(() => setProfileSaveMsg(''), 3000);
    } catch (err) {
      setAuthError(err.message || 'Не удалось сохранить анкету');
    }
  };

  const isLoggedIn = Boolean(user && (user.phone || loyaltyProfile));
  const profile = loyaltyProfile || {
    phone: user?.phone || '',
    name: user?.name || 'Гость',
    fullName: user?.fullName || user?.name || 'Гость',
    balance: 0,
    cashbackPercent: 10,
    tierTitle: 'Gusto Friend',
    totalSpent: 0,
    ordersCount: 0,
    nextTier: {
      percent: 15,
      title: 'Gusto Regular',
      threshold: 85000,
      remaining: 85000,
      progressPercent: 0,
    },
    tiers: [
      { percent: 10, title: 'Gusto Friend', threshold: 0 },
      { percent: 15, title: 'Gusto Regular', threshold: 85000 },
      { percent: 20, title: 'Gusto Resident', threshold: 115000 },
    ],
  };

  const qrForWaiterUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=6&data=${encodeURIComponent(
    profile.phone || 'GUSTO'
  )}`;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Верхняя шапка модалки */}
        <div className={styles.header}>
          <div className={styles.headerBrand}>
            <img src={logoGusto} alt="Gusto" className={styles.brandLogo} />
            <div>
              <h2 className={styles.headerTitle}>
                {isLoggedIn ? 'Личный кабинет' : 'Gusto Club • Бонусы'}
              </h2>
              <span className={styles.headerSubtitle}>
                {isLoggedIn ? 'Бонусная программа iiko' : 'Кешбэк от 10% до 20% с каждого заказа'}
              </span>
            </div>
          </div>

          <button type="button" className={styles.closeBtn} onClick={handleClose} aria-label="Закрыть">
            ✕
          </button>
        </div>

        {/* КОНТЕНТ: АВТОРИЗАЦИЯ ИЛИ ЛИЧНЫЙ КАБИНЕТ */}
        {!isLoggedIn ? (
          <div className={styles.authBody}>
            {/* Превью привилегий перед входом */}
            <div className={styles.welcomeBanner}>
              <div className={styles.welcomeBadges}>
                <span className={styles.tierPillActive}>10% со старта</span>
                <span className={styles.tierPill}>15% от 85 000 ₽</span>
                <span className={styles.tierPill}>20% VIP</span>
              </div>
              <p className={styles.welcomeText}>
                Копите баллы при заказе через QR-меню или у официанта. <strong>1 бонус = 1 ₽</strong>.
              </p>
            </div>

            {authStep === 'phone' ? (
              <form onSubmit={handleSendSms} className={styles.authForm}>
                <label className={styles.fieldLabel}>Номер телефона</label>
                <input
                  type="tel"
                  className={styles.phoneInput}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(formatPhoneInput(e.target.value))}
                  placeholder="+7 (999) 000-00-00"
                  autoFocus
                />

                {authError && <div className={styles.errorBox}>{authError}</div>}

                <button type="submit" className={styles.primaryBtn} disabled={isSending}>
                  {isSending ? 'Отправляем код...' : 'Получить код по SMS'}
                </button>

                <div className={styles.orDivider}>
                  <span>или быстрый вход</span>
                </div>

                {/* Кнопка Яндекс ID */}
                <button type="button" className={styles.yandexBtn} onClick={handleYandexAuth}>
                  <span className={styles.yaIcon}>Я</span>
                  <span>Войти с Яндекс ID</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifySms} className={styles.authForm}>
                <div className={styles.sentInfo}>
                  Отправили 4-значный код на номер <strong>{phoneInput}</strong>
                  <button
                    type="button"
                    className={styles.changePhoneLink}
                    onClick={() => {
                      setAuthStep('phone');
                      setAuthError('');
                    }}
                  >
                    Изменить
                  </button>
                </div>

                {devCodeHint && (
                  <div className={styles.devCodeBanner}>
                    <span>Тестовый SMS-код:</span>
                    <strong>{devCodeHint}</strong>
                  </div>
                )}

                <label className={styles.fieldLabel}>Код подтверждения</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  className={styles.codeInput}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • •"
                  autoFocus
                />

                {authError && <div className={styles.errorBox}>{authError}</div>}

                <button type="submit" className={styles.primaryBtn} disabled={isSending}>
                  {isSending ? 'Загружаем карту из iiko...' : 'Подтвердить и войти'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className={styles.cabinetBody}>
            {/* 1. КЛУБНАЯ КАРТА GUSTO LOUNGE */}
            <div className={styles.loyaltyCard}>
              <div className={styles.cardGlow} />

              <div className={styles.cardTopRow}>
                <div>
                  <span className={styles.cardClubLabel}>GUSTO LOUNGE CLUB</span>
                  <h3 className={styles.cardHolderName}>{profile.fullName || profile.name}</h3>
                  <span className={styles.cardPhone}>{profile.phone}</span>
                </div>

                <div className={styles.cashbackBadge}>
                  <span className={styles.cashbackValue}>{profile.cashbackPercent}%</span>
                  <span className={styles.cashbackCaption}>кешбэк</span>
                </div>
              </div>

              {!showCardQr ? (
                <div className={styles.cardBalanceSection}>
                  <div className={styles.balanceBlock}>
                    <span className={styles.balanceLabel}>Доступный баланс</span>
                    <div className={styles.balanceRow}>
                      <span className={styles.balanceNumber}>
                        {Number(profile.balance || 0).toLocaleString('ru-RU')}
                      </span>
                      <span className={styles.balanceUnit}>бонусов</span>
                    </div>
                    <span className={styles.balanceSub}>1 бонус = 1 ₽ • {profile.tierTitle}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.showQrBtn}
                    onClick={() => setShowCardQr(true)}
                  >
                    <span>QR для официанта</span>
                  </button>
                </div>
              ) : (
                <div className={styles.cardQrView}>
                  <div className={styles.qrImageBox}>
                    <img src={qrForWaiterUrl} alt="QR карты гостя" className={styles.waiterQrImg} />
                  </div>
                  <div className={styles.qrHintBlock}>
                    <strong>Покажите QR официанту</strong>
                    <p>Для начисления или списания бонусов на кассе iikoFront</p>
                    <button
                      type="button"
                      className={styles.hideQrBtn}
                      onClick={() => setShowCardQr(false)}
                    >
                      ← Вернуться к балансу
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. ПРОГРЕСС ДО СЛЕДУЮЩЕГО УРОВНЯ И СЧЁТЧИКИ IIKO */}
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Визитов в Gusto</span>
                <strong className={styles.statValue}>{profile.ordersCount || 0}</strong>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Сумма заказов</span>
                <strong className={styles.statValue}>
                  {Number(profile.totalSpent || 0).toLocaleString('ru-RU')} ₽
                </strong>
              </div>
            </div>

            {profile.nextTier ? (
              <div className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressTitle}>
                    До уровня <strong>{profile.nextTier.percent}% ({profile.nextTier.title})</strong>
                  </span>
                  <span className={styles.progressRemaining}>
                    ещё {Number(profile.nextTier.remaining).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className={styles.progressBarTrack}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${Math.max(4, profile.nextTier.progressPercent || 0)}%` }}
                  />
                </div>
                <div className={styles.progressFoot}>
                  <span>Накоплено: {Number(profile.totalSpent || 0).toLocaleString('ru-RU')} ₽</span>
                  <span>Порог: {Number(profile.nextTier.threshold).toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            ) : (
              <div className={styles.vipMaxBanner}>
                🏆 У вас максимальный статус <strong>Gusto Resident (20% кешбэк)</strong>!
              </div>
            )}

            {/* 3. СЕТКА УРОВНЕЙ ЛОЯЛЬНОСТИ IIKO */}
            <div className={styles.tiersSection}>
              <div className={styles.sectionTitle}>Уровни бонусной программы</div>
              <div className={styles.tiersRow}>
                {(profile.tiers || []).map((t) => {
                  const isCurrent = Number(t.percent) === Number(profile.cashbackPercent);
                  const isUnlocked = Number(profile.cashbackPercent) >= Number(t.percent);
                  return (
                    <div
                      key={t.percent}
                      className={`${styles.tierCard} ${isCurrent ? styles.tierCardCurrent : ''} ${
                        isUnlocked ? styles.tierCardUnlocked : ''
                      }`}
                    >
                      <div className={styles.tierPercent}>{t.percent}%</div>
                      <div className={styles.tierName}>{t.title}</div>
                      <div className={styles.tierThreshold}>
                        {t.threshold === 0
                          ? 'При регистрации'
                          : `от ${(t.threshold / 1000).toFixed(0)} тыс. ₽`}
                      </div>
                      {isCurrent && <span className={styles.currentTag}>Ваш статус</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. АНКЕТА ГОСТЯ (РЕДАКТИРОВАНИЕ И СИНХРОНИЗАЦИЯ С IIKO) */}
            {!isEditingProfile ? (
              <div className={styles.profileFooter}>
                {profileSaveMsg && <div className={styles.savedToast}>✓ {profileSaveMsg}</div>}

                <div className={styles.footerButtons}>
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={() => setIsEditingProfile(true)}
                  >
                    Анкета гостя
                  </button>

                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={() => fetchLoyaltyProfile()}
                    disabled={isLoyaltyLoading}
                  >
                    {isLoyaltyLoading ? 'Обновляем...' : '↻ Обновить баланс'}
                  </button>

                  <button
                    type="button"
                    className={styles.logoutBtn}
                    onClick={() => {
                      logout();
                      setAuthStep('phone');
                    }}
                  >
                    Выйти
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className={styles.editProfileForm}>
                <div className={styles.sectionTitle}>Анкета гостя в iiko</div>
                <div className={styles.editGrid}>
                  <div>
                    <label className={styles.fieldLabel}>Имя</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className={styles.fieldLabel}>Фамилия</label>
                    <input
                      type="text"
                      className={styles.textInput}
                      value={editSurname}
                      onChange={(e) => setEditSurname(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={styles.fieldLabel}>Дата рождения</label>
                  <input
                    type="date"
                    className={styles.textInput}
                    value={editBirthday || ''}
                    onChange={(e) => setEditBirthday(e.target.value)}
                  />
                </div>

                <div className={styles.editActions}>
                  <button
                    type="button"
                    className={styles.secondaryActionBtn}
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Отмена
                  </button>
                  <button type="submit" className={styles.primaryBtn} disabled={isLoyaltyLoading}>
                    {isLoyaltyLoading ? 'Сохраняем...' : 'Сохранить в iiko'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoyaltyModal;
