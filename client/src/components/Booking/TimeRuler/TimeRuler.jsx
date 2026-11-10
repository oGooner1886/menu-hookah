import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from './TimeRuler.module.css';
import CalendarModal from './CalendarModal';

// Режим работы заведения: с 12:00 дня до 03:00 ночи
const START_HOUR = 12;
const END_HOUR = 27; // 03:00 следующего дня (24 + 3)
const START_MINUTES = START_HOUR * 60; // 720 минут
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 900 минут (15 часов)
const STEP_MINUTES = 10; // Шаг деления — 10 минут
const TICK_WIDTH = 16; // Ширина одного 10-минутного деления в пикселях

// Преобразование "17:30" в минуты от 00:00 (с учетом перехода через полночь)
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 17 * 60 + 30; // 17:30 по умолчанию
  const [h, m] = timeStr.split(':').map(Number);
  let total = h * 60 + m;
  if (h < START_HOUR) total += 24 * 60; // для 00:00 - 03:00
  return total;
};

// Преобразование минут в строку "HH:mm"
const formatMinutesToTime = (min) => {
  const normalized = min % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

const MONTH_NAMES = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

const TimeRuler = ({ selectedDate, onChangeDate, selectedTime, onChangeTime }) => {
  const scrollRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const isManualScrollingRef = useRef(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Форматирование заголовка выбранной даты (Сегодня, Завтра или 15 ноября)
  const dateTitle = useMemo(() => {
    if (!selectedDate) return 'Сегодня';
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowIso = tomorrow.toISOString().split('T')[0];

    if (selectedDate === todayIso) return 'Сегодня';
    if (selectedDate === tomorrowIso) return 'Завтра';

    const [y, m, d] = selectedDate.split('-').map(Number);
    const monthName = MONTH_NAMES[m - 1] || '';
    return `${d} ${monthName}`;
  }, [selectedDate]);

  // Генерация делений линейки с 12:00 до 03:00
  const ticks = useMemo(() => {
    const list = [];
    for (let m = START_MINUTES; m <= START_MINUTES + TOTAL_MINUTES; m += STEP_MINUTES) {
      const isHour = m % 60 === 0;
      const isHalf = m % 60 === 30;
      const timeStr = formatMinutesToTime(m);

      list.push({
        minutes: m,
        isHour,
        isHalf,
        timeStr,
      });
    }
    return list;
  }, []);

  // Синхронизация скролла с внешним selectedTime при первом рендере или смене извне
  const syncScrollToTime = useCallback((timeStr, behavior = 'smooth') => {
    if (!scrollRef.current) return;
    const min = parseTimeToMinutes(timeStr);
    const clamped = Math.max(START_MINUTES, Math.min(START_MINUTES + TOTAL_MINUTES, min));
    const tickIndex = (clamped - START_MINUTES) / STEP_MINUTES;
    const targetScroll = tickIndex * TICK_WIDTH;

    isManualScrollingRef.current = true;
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior,
    });
    setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 300);
  }, []);

  useEffect(() => {
    // Начальная позиция при открытии
    syncScrollToTime(selectedTime, 'auto');
  }, []);

  // Обработка скролла линейки: вычисляем время под фиксированным центром
  const handleScroll = () => {
    if (!scrollRef.current || isManualScrollingRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const rawStepIndex = scrollLeft / TICK_WIDTH;
    const stepIndex = Math.round(rawStepIndex);
    const minutes = START_MINUTES + stepIndex * STEP_MINUTES;
    const clamped = Math.max(START_MINUTES, Math.min(START_MINUTES + TOTAL_MINUTES, minutes));

    const newTime = formatMinutesToTime(clamped);
    if (newTime !== selectedTime) {
      onChangeTime(newTime);
    }
  };

  // Drag-and-drop перетаскивание линейки (Restoplace style)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
  };

  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartScrollRef.current = scrollRef.current.scrollLeft;
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || !scrollRef.current) return;
      const deltaX = e.clientX - dragStartXRef.current;
      scrollRef.current.scrollLeft = dragStartScrollRef.current - deltaX;
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || !scrollRef.current) return;
      const deltaX = e.touches[0].clientX - dragStartXRef.current;
      scrollRef.current.scrollLeft = dragStartScrollRef.current - deltaX;
    };

    const handleEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        // Мягкий довод до ближайшего 10-минутного деления
        if (scrollRef.current) {
          const scrollLeft = scrollRef.current.scrollLeft;
          const nearestStep = Math.round(scrollLeft / TICK_WIDTH);
          scrollRef.current.scrollTo({
            left: nearestStep * TICK_WIDTH,
            behavior: 'smooth',
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return (
    <div className={styles.container}>
      {/* 1. Верхняя панель: Забронировать, Текущее время по центру, Дата справа */}
      <div className={styles.topRow}>
        <h2 className={styles.title}>Забронировать</h2>

        {/* Индикатор выбранного времени над фиксированным центром */}
        <div className={styles.centerTimeIndicator}>
          <span className={styles.timeLabel}>с {selectedTime} ч.</span>
        </div>

        {/* Кнопка открытия календаря на месяц */}
        <div className={styles.dateWrap}>
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className={styles.dateBtn}
            title="Выбрать дату в календаре"
          >
            <span>{dateTitle}</span>
            <span className={styles.dateArrow}>▾</span>
          </button>
        </div>
      </div>

      {/* 2. Зона линейки со сдвигом полотна (Restoplace style) */}
      <div className={styles.rulerViewport}>
        {/* Фиксированный центральный пин-указатель */}
        <div className={styles.fixedCenterPin}>
          <div className={styles.pinDot} />
          <div className={styles.pinNeedle} />
        </div>

        {/* Сама подвижная лента-линейка */}
        <div
          className={styles.scrollTape}
          ref={scrollRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className={styles.tapeTrack}>
            {ticks.map((tick) => (
              <div
                key={tick.minutes}
                className={`${styles.tickItem} ${
                  tick.isHour
                    ? styles.tickHour
                    : tick.isHalf
                    ? styles.tickHalf
                    : styles.tickSmall
                }`}
                style={{ width: `${TICK_WIDTH}px` }}
              >
                {/* Линия деления */}
                <div className={styles.tickLine} />

                {/* Подпись часа */}
                {tick.isHour && (
                  <span className={styles.hourLabel}>{tick.timeStr}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Модальный календарь на текущий и будущие месяцы */}
      {isCalendarOpen && (
        <CalendarModal
          selectedDate={selectedDate}
          onChangeDate={onChangeDate}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </div>
  );
};

export default TimeRuler;
