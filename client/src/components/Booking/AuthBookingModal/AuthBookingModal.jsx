import React, { useState } from 'react';
import styles from './AuthBookingModal.module.css';

const AuthBookingModal = ({
  isOpen,
  onClose,
  selectedTable,
  selectedDate,
  selectedTime,
  selectedGuests,
  onSuccessBooking,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'sms' | 'success'
  const [smsCode, setSmsCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !selectedTable) return null;

  const handleSendSms = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    // Имитация отправки SMS для брони
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('sms');
    }, 600);
  };

  const handleVerifySms = (e) => {
    e.preventDefault();
    if (!smsCode.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('success');
      if (onSuccessBooking) {
        onSuccessBooking({
          table: selectedTable,
          date: selectedDate,
          time: selectedTime,
          guests: selectedGuests,
          name,
          phone,
          comment,
        });
      }
    }, 700);
  };

  const handleYandexAuth = () => {
    setIsSubmitting(true);
    // Быстрый вход через Яндекс ID (моковый сценарий)
    setTimeout(() => {
      setName('Гость Яндекс');
      setPhone('+7 (999) 000-00-00');
      setIsSubmitting(false);
      setStep('success');
      if (onSuccessBooking) {
        onSuccessBooking({
          table: selectedTable,
          date: selectedDate,
          time: selectedTime,
          guests: selectedGuests,
          name: 'Гость Яндекс',
          phone: '+7 (999) 000-00-00',
          comment,
        });
      }
    }, 800);
  };

  const handleClose = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>
            {step === 'success' ? 'Бронь подтверждена!' : 'Бронирование стола'}
          </h2>
          <button type="button" onClick={handleClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Сводка по выбранному столу */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Стол:</span>
            <strong className={styles.summaryValue}>{selectedTable.tableName || `Стол №${selectedTable.number}`}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Дата и время:</span>
            <span className={styles.summaryValue}>{selectedDate}, {selectedTime}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Гостей:</span>
            <span className={styles.summaryValue}>до {selectedGuests} человек</span>
          </div>
          <div className={styles.depositRow}>
            <span>Депозит бронирования:</span>
            <strong>500 ₽</strong>
          </div>
          <div className={styles.depositNote}>
            Сумма депозита полностью идёт в счёт оплаты вашего заказа в заведении
          </div>
        </div>

        {/* Шаг 1: Контакты */}
        {step === 'form' && (
          <form onSubmit={handleSendSms} className={styles.form}>
            {/* Кнопка входа через Яндекс ID */}
            <button
              type="button"
              onClick={handleYandexAuth}
              className={styles.yandexBtn}
            >
              <span className={styles.yandexLogo}>Я</span>
              <span>Войти с Яндекс ID в 1 клик</span>
            </button>

            <div className={styles.divider}>
              <span>или укажите контакты</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ваше имя</label>
              <input
                type="text"
                placeholder="Как к вам обращаться"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Номер телефона</label>
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Пожелания (необязательно)</label>
              <input
                type="text"
                placeholder="День рождения, розетка у стола и т.д."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !phone.trim()}
              className={styles.submitBtn}
            >
              {isSubmitting ? 'Отправляем код...' : 'Внести депозит 500 ₽ и подтвердить'}
            </button>
          </form>
        )}

        {/* Шаг 2: Ввод SMS кода */}
        {step === 'sms' && (
          <form onSubmit={handleVerifySms} className={styles.form}>
            <p className={styles.smsDesc}>
              Мы отправили SMS-код подтверждения на номер <strong>{phone}</strong>
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Код из SMS</label>
              <input
                type="text"
                placeholder="4-значный код"
                inputMode="numeric"
                maxLength={6}
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                required
                autoFocus
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !smsCode.trim()}
              className={styles.submitBtn}
            >
              {isSubmitting ? 'Проверяем код...' : 'Подтвердить бронь'}
            </button>
          </form>
        )}

        {/* Шаг 3: Успех */}
        {step === 'success' && (
          <div className={styles.successBlock}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successTitle}>Стол успешно забронирован!</p>
            <p className={styles.successText}>
              Ждём вас <strong>{selectedDate}</strong> в <strong>{selectedTime}</strong>. 
              Стол <strong>{selectedTable.tableName}</strong> закреплен за вами.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className={styles.submitBtn}
            >
              Отлично
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthBookingModal;

