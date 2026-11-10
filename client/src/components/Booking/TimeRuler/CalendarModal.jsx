import React, { useState, useMemo } from 'react';
import styles from './CalendarModal.module.css';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const CalendarModal = ({ selectedDate, onChangeDate, onClose }) => {
  // Текущая дата для валидации прошедших дней
  const today = useMemo(() => new Date(), []);
  const todayIso = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // Месяц и год, который сейчас открыт в календаре
  const initialDate = selectedDate ? new Date(selectedDate) : today;
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-11

  // Переключение месяцев
  const handlePrevMonth = () => {
    if (viewYear === today.getFullYear() && viewMonth <= today.getMonth()) {
      return; // Нельзя листать раньше текущего месяца
    }
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isPrevDisabled =
    viewYear === today.getFullYear() && viewMonth <= today.getMonth();

  // Генерация дней сетки календаря
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // День недели первого дня (0 - Вс, 1 - Пн ... 6 - Сб)
    let startDayOfWeek = firstDayOfMonth.getDay();
    // Преобразуем к российскому формату: 0 - Пн ... 6 - Вс
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const totalDays = lastDayOfMonth.getDate();
    const cells = [];

    // Пустые ячейки до начала месяца
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ empty: true, key: `empty-${i}` });
    }

    // Дни месяца
    for (let d = 1; d <= totalDays; d++) {
      const monthStr = String(viewMonth + 1).padStart(2, '0');
      const dayStr = String(d).padStart(2, '0');
      const iso = `${viewYear}-${monthStr}-${dayStr}`;

      const cellDate = new Date(viewYear, viewMonth, d);
      const isPast = iso < todayIso;
      const isSelected = selectedDate === iso;
      const isToday = iso === todayIso;

      cells.push({
        dayNumber: d,
        iso,
        isPast,
        isSelected,
        isToday,
        key: iso,
      });
    }

    return cells;
  }, [viewYear, viewMonth, todayIso, selectedDate]);

  const handleSelectDay = (day) => {
    if (day.isPast) return;
    onChangeDate(day.iso);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.calendarCard}>
        {/* Шапка календаря: месяц, год и кнопки листания */}
        <div className={styles.header}>
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={styles.navBtn}
            title="Предыдущий месяц"
          >
            ‹
          </button>

          <span className={styles.monthTitle}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className={styles.navBtn}
            title="Следующий месяц"
          >
            ›
          </button>
        </div>

        {/* Дни недели: Пн Вт Ср Чт Пт Сб Вс */}
        <div className={styles.weekHeader}>
          {WEEK_DAYS.map((w, index) => (
            <span
              key={w}
              className={`${styles.weekDay} ${index >= 5 ? styles.weekEnd : ''}`}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Сетка дней месяца */}
        <div className={styles.daysGrid}>
          {calendarDays.map((cell) => {
            if (cell.empty) {
              return <div key={cell.key} className={styles.emptyCell} />;
            }

            return (
              <button
                key={cell.key}
                type="button"
                disabled={cell.isPast}
                onClick={() => handleSelectDay(cell)}
                className={`${styles.dayBtn} ${
                  cell.isPast
                    ? styles.dayPast
                    : cell.isSelected
                    ? styles.daySelected
                    : cell.isToday
                    ? styles.dayToday
                    : ''
                }`}
              >
                {cell.dayNumber}
              </button>
            );
          })}
        </div>

        <button type="button" onClick={onClose} className={styles.closeBtn}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default CalendarModal;

