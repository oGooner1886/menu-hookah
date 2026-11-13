import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Booking.module.css';
import TimeRuler from './TimeRuler/TimeRuler';
import FloorMap from './FloorMap/FloorMap';
import TableView from './TableView/TableView';
import AuthBookingModal from './AuthBookingModal/AuthBookingModal';
import logoGusto from '../../assets/images/gusto lounge logo-1.png';

const API_BASE_URL = 'http://localhost:3000/api';

const Booking = () => {
  const navigate = useNavigate();
  const { branch } = useParams();
  const branchName = branch === 'aroma' ? 'Aroma' : 'Gusto Lounge';

  // Состояние бронирования
  const todayIso = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedTime, setSelectedTime] = useState('17:30');
  const [selectedGuests, setSelectedGuests] = useState(4);
  const [activeHall, setActiveHall] = useState('all');
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [occupiedTableNumbers, setOccupiedTableNumbers] = useState([]);
  const [liveOccupiedTables, setLiveOccupiedTables] = useState([]);
  const [isLoadingWorkload, setIsLoadingWorkload] = useState(false);

  // Загружаем реальную занятость столов из iikoCloud через наш бэкенд (с debounce 200ms)
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(async () => {
      setIsLoadingWorkload(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/tables/workload?date=${selectedDate}&time=${selectedTime}`
        );
        const data = await res.json();
        if (!isCancelled && data.success) {
          if (Array.isArray(data.occupiedTables)) {
            setOccupiedTableNumbers(data.occupiedTables);
          }
          if (Array.isArray(data.liveOccupiedTables)) {
            setLiveOccupiedTables(data.liveOccupiedTables);
          }
        }
      } catch (err) {
        console.error('Ошибка загрузки занятости столов:', err);
      } finally {
        if (!isCancelled) setIsLoadingWorkload(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedDate, selectedTime]);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleProceed = () => {
    if (!selectedTable) return;
    setIsAuthModalOpen(true);
  };

  const handleSuccessBooking = async (bookingData) => {
    try {
      await fetch(`${API_BASE_URL}/tables/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber: bookingData.table.number,
          date: bookingData.date,
          time: bookingData.time,
          guests: bookingData.guests,
          name: bookingData.name,
          phone: bookingData.phone,
          comment: bookingData.comment,
        }),
      });

      // Сразу обновляем занятость столов
      const res = await fetch(
        `${API_BASE_URL}/tables/workload?date=${selectedDate}&time=${selectedTime}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.occupiedTables)) {
        setOccupiedTableNumbers(data.occupiedTables);
      }
    } catch (err) {
      console.error('Ошибка сохранения брони в iiko:', err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.widgetBox}>
        {/* 1. Верхний хедер в стиле Restoplace */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <img src={logoGusto} alt={branchName} className={styles.logo} />
            <div className={styles.venueInfo}>
              <h1 className={styles.venueTitle}>{branchName}</h1>
              <span className={styles.venueAddress}>Астрахань • Лаунж-бар</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <a href="tel:+79021150021" className={styles.phoneLink}>
              <span className={styles.phoneIcon}>📞</span>
              <span className={styles.phoneNumber}>+7 (902) 115-00-21</span>
            </a>

            <button
              type="button"
              onClick={() => navigate(`/${branch || 'gusto'}/menu`)}
              className={styles.closeBtn}
              title="Перейти в меню"
            >
              ✕
            </button>
          </div>
        </header>

        {/* 2. Линейка времени с делениями и датой (Restoplace style) */}
        <TimeRuler
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          selectedTime={selectedTime}
          onChangeTime={setSelectedTime}
        />

        {/* 3. Основная интерактивная зона (Схема зала / Список столов) */}
        <main className={styles.mainArea}>
          {viewMode === 'map' ? (
            <FloorMap
              selectedTable={selectedTable}
              onSelectTable={handleSelectTable}
              activeHall={activeHall}
              setActiveHall={setActiveHall}
              occupiedTableNumbers={occupiedTableNumbers}
              liveOccupiedTables={liveOccupiedTables}
            />
          ) : (
            <TableView
              selectedTable={selectedTable}
              onSelectTable={handleSelectTable}
              occupiedTableNumbers={occupiedTableNumbers}
              liveOccupiedTables={liveOccupiedTables}
              activeHall={activeHall}
            />
          )}
        </main>

        {/* 4. Нижняя панель действий (СПИСОК / СХЕМА + Кнопка бронирования) */}
        <footer className={styles.bottomBar}>
          {/* Переключатель вида: СПИСОК / СХЕМА */}
          <div className={styles.viewToggleGroup}>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
            >
              СПИСОК
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`${styles.viewToggleBtn} ${viewMode === 'map' ? styles.viewToggleBtnActive : ''}`}
            >
              СХЕМА
            </button>
          </div>

          {/* Легенда цветов */}
          <div className={styles.bottomLegend}>
            <div className={styles.legendDotItem}>
              <span className={styles.dotGreen} />
              <span>Свободен</span>
            </div>
            <div className={styles.legendDotItem}>
              <span className={styles.dotRed} />
              <span>Занят</span>
            </div>
          </div>

          {/* Кнопка действия справа */}
          <div className={styles.actionWrap}>
            {selectedTable ? (
              <button
                type="button"
                onClick={handleProceed}
                className={styles.bookActiveBtn}
              >
                <span>Забронировать {selectedTable.tableName}</span>
                <span className={styles.depositBadge}>500 ₽</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  // Выбираем первый свободный стол по умолчанию
                  const firstFree = GUSTO_TABLES_FIND_FREE(occupiedTableNumbers);
                  if (firstFree) setSelectedTable(firstFree);
                }}
                className={styles.waitlistBtn}
              >
                ВЫБЕРИТЕ СТОЛ
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* Модальное окно подтверждения брони с депозитом 500 ₽ */}
      <AuthBookingModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        selectedTable={selectedTable}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedGuests={selectedGuests}
        onSuccessBooking={handleSuccessBooking}
      />
    </div>
  );
};

// Хелпер первого свободного стола
const GUSTO_TABLES_FIND_FREE = (occupiedNumbers) => {
  const freeNumbers = ['1', '5', '6', '7', '9', '10', '21', '24'];
  const freeId = freeNumbers.find((n) => !occupiedNumbers.includes(n));
  return freeId ? { number: freeId, tableName: `Стол ${freeId}`, sectionName: 'Зеленый' } : null;
};

export default Booking;
