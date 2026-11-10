import React, { useMemo } from 'react';
import styles from './DateTimeGuests.module.css';

const TIME_SLOTS = [
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00',
  '00:00', '01:00',
];

const GUEST_OPTIONS = [
  { label: '1–2 чел', value: 2 },
  { label: '3–4 чел', value: 4 },
  { label: '5–6 чел', value: 6 },
  { label: '7+ чел', value: 8 },
];

const MONTH_NAMES = [
  'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

const DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const DateTimeGuests = ({
  selectedDate,
  onChangeDate,
  selectedTime,
  onChangeTime,
  selectedGuests,
  onChangeGuests,
}) => {
  // Генерируем плашки на ближайшие 7 дней
  const datePills = useMemo(() => {
    const list = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : DAY_NAMES[d.getDay()];
      const dayNum = d.getDate();
      const month = MONTH_NAMES[d.getMonth()];

      list.push({
        iso,
        label: `${dayName}, ${dayNum} ${month}`,
        isToday: i === 0,
      });
    }
    return list;
  }, []);

  return (
    <div className={styles.container}>
      {/* 1. Выбор даты */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>1. Выберите дату</span>
        </div>
        <div className={styles.pillsRow}>
          {datePills.map((p) => {
            const isSelected = selectedDate === p.iso;
            return (
              <button
                key={p.iso}
                type="button"
                onClick={() => onChangeDate(p.iso)}
                className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ''}`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Выбор времени */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>2. Выберите время</span>
        </div>
        <div className={styles.pillsRow}>
          {TIME_SLOTS.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                type="button"
                onClick={() => onChangeTime(time)}
                className={`${styles.pillBtn} ${styles.timePill} ${isSelected ? styles.pillBtnActive : ''}`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Количество персон */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>3. Количество гостей</span>
        </div>
        <div className={styles.guestsRow}>
          {GUEST_OPTIONS.map((g) => {
            const isSelected = selectedGuests === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => onChangeGuests(g.value)}
                className={`${styles.pillBtn} ${styles.guestPill} ${isSelected ? styles.pillBtnActive : ''}`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DateTimeGuests;

