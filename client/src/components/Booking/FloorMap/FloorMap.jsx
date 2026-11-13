import React, { useState, useRef, useEffect, useMemo } from 'react';
import styles from './FloorMap.module.css';
import { GUSTO_TABLES } from '../../../config/gustoTables';

const FloorMap = ({
  selectedTable,
  onSelectTable,
  activeHall,
  setActiveHall,
  occupiedTableNumbers = [],
  liveOccupiedTables = [],
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const touchDistRef = useRef(null);

  // Сброс позиции и масштаба при переключении зала
  useEffect(() => {
    setPan({ x: 0, y: 0 });
    setZoomLevel(1);
  }, [activeHall]);

  // Зум колесиком мыши (с предотвращением скролла страницы)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY < 0 ? 0.12 : -0.12;
      setZoomLevel((prev) => {
        const next = Math.min(2.8, Math.max(0.6, prev + zoomDelta));
        return Number(next.toFixed(2));
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Глобальное отслеживание перемещения мыши (Drag & Pan)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      if (!hasMovedRef.current && Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedRef.current) {
        setPan({
          x: Math.round(dragStartRef.current.startPanX + dx),
          y: Math.round(dragStartRef.current.startPanY + dy),
        });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.8, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, Number((z - 0.2).toFixed(2))));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  // Начало перетаскивания мышью
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button')) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  // Сенсорное управление на мобильных (Touch pan & Pinch zoom)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      isDraggingRef.current = true;
      hasMovedRef.current = false;
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
    } else if (e.touches.length === 2) {
      isDraggingRef.current = false;
      touchDistRef.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDraggingRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;

      if (!hasMovedRef.current && Math.hypot(dx, dy) > 4) {
        hasMovedRef.current = true;
        setIsDragging(true);
      }

      if (hasMovedRef.current) {
        setPan({
          x: Math.round(dragStartRef.current.startPanX + dx),
          y: Math.round(dragStartRef.current.startPanY + dy),
        });
      }
    } else if (e.touches.length === 2 && touchDistRef.current) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = d / touchDistRef.current;
      if (Math.abs(1 - ratio) > 0.02) {
        setZoomLevel((prev) => Math.min(2.8, Math.max(0.6, Number((prev * ratio).toFixed(2)))));
        touchDistRef.current = d;
      }
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    touchDistRef.current = null;
  };

  // Клик по свободному месту в зале (снимает выбор со стола)
  const handleBackgroundClick = () => {
    // Если пользователь перемещал карту, игнорируем клик
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    onSelectTable(null);
  };

  // Подсчет свободных столов в каждом зале
  const greenFreeCount = GUSTO_TABLES.filter(
    (t) => t.sectionName === 'Зеленый' && !occupiedTableNumbers.includes(String(t.number))
  ).length;

  const secondFreeCount = GUSTO_TABLES.filter(
    (t) => t.sectionName === 'Второй зал' && !occupiedTableNumbers.includes(String(t.number))
  ).length;

  // Фильтрация столов по выбранному залу
  const tablesToRender = GUSTO_TABLES.filter((t) => {
    if (activeHall === 'green') return t.sectionName === 'Зеленый';
    if (activeHall === 'second') return t.sectionName === 'Второй зал';
    return true;
  });

  // Фокусировка камеры SVG на выбранном зале
  const svgViewBox = useMemo(() => {
    if (activeHall === 'green') return '15 15 390 175';
    if (activeHall === 'second') return '405 15 215 175';
    return '0 0 635 200';
  }, [activeHall]);

  return (
    <div className={styles.mapContainer}>
      {/* Переключатель залов (Restoplace style) */}
      <div className={styles.hallSwitcher}>
        <button
          type="button"
          onClick={() => setActiveHall('green')}
          className={`${styles.hallPill} ${activeHall === 'green' ? styles.hallPillActive : ''}`}
        >
          <span className={styles.hallDotGreen} />
          <span>Зелёный зал ({greenFreeCount} св.)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveHall('all')}
          className={`${styles.hallPill} ${activeHall === 'all' ? styles.hallPillActive : ''}`}
        >
          <span>Вся схема</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveHall('second')}
          className={`${styles.hallPill} ${activeHall === 'second' ? styles.hallPillActive : ''}`}
        >
          <span className={styles.hallDotGreen} />
          <span>Второй зал ({secondFreeCount} св.)</span>
        </button>
      </div>

      {/* Окно карты: навигация внутри залов */}
      <div
        ref={viewportRef}
        className={`${styles.mapViewport} ${isDragging ? styles.mapViewportDragging : ''}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleBackgroundClick}
      >
        {/* Кнопки масштабирования справа (Restoplace style) */}
        <div className={styles.zoomControls}>
          <button type="button" onClick={handleZoomIn} className={styles.zoomBtn} title="Увеличить">
            +
          </button>
          <button type="button" onClick={handleZoomOut} className={styles.zoomBtn} title="Уменьшить">
            −
          </button>
          <button type="button" onClick={handleResetZoom} className={styles.zoomBtn} title="По размеру экрана">
            ⌖
          </button>
        </div>

        {/* Пространство заведения с GPU трансформацией перемещения */}
        <div
          className={styles.svgScrollArea}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <svg
            viewBox={svgViewBox}
            className={styles.svgMap}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Внешний фон зала */}
            <rect x="-100" y="-100" width="850" height="400" fill="#141416" />

            {/* Пол и стены заведения Gusto Lounge */}
            <rect x="15" y="15" width="605" height="175" rx="8" fill="#1e1e22" stroke="#37373f" strokeWidth="2" />

            {/* Разделитель залов (Зеленый / Второй) */}
            <line x1="405" y1="15" x2="405" y2="190" stroke="#4b4b54" strokeWidth="1.5" strokeDasharray="5 4" />
            <text x="210" y="24" fill="#888" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="1">
              ЗЕЛЁНЫЙ ЗАЛ
            </text>
            <text x="510" y="24" fill="#888" fontSize="8" fontWeight="700" textAnchor="middle" letterSpacing="1">
              ВТОРОЙ ЗАЛ
            </text>

            {/* Барная стойка */}
            <rect x="160" y="72" width="68" height="42" rx="4" fill="#292930" stroke="#444450" strokeWidth="1" />
            <text x="194" y="96" fill="#888" fontSize="8" fontWeight="600" textAnchor="middle">
              БАР
            </text>

            {/* Овальный подиум */}
            <ellipse cx="305" cy="100" rx="36" ry="26" fill="#25252c" stroke="#3c3c46" strokeWidth="1.5" />
            <text x="305" y="103" fill="#666" fontSize="7" fontWeight="600" textAnchor="middle">
              ПОДИУМ
            </text>

            {/* Сцена во втором зале */}
            <path d="M 470 120 Q 505 130 540 120" stroke="#444" strokeWidth="1.5" fill="none" />
            <text x="505" y="128" fill="#666" fontSize="7" textAnchor="middle">
              СЦЕНА
            </text>

            {/* Отрисовка столов выбранного зала */}
            {tablesToRender.map((t) => {
              const isOccupied = occupiedTableNumbers.includes(String(t.number));
              const isSelected = selectedTable && String(selectedTable.number) === String(t.number);

              // Цвета Restoplace: Зеленый = свободен, Малиновый = занят, Голубой/Циан = активный/выбранный
              let mainColor = '#10b981'; // Green
              let strokeColor = '#059669';
              let sofaColor = '#10b981';
              let textColor = '#ffffff';

              if (isOccupied) {
                mainColor = '#e11d48'; // Crimson / Red
                strokeColor = '#be123c';
                sofaColor = '#e11d48';
              } else if (isSelected) {
                mainColor = '#06b6d4'; // Яркий Cyan для активного стола
                strokeColor = '#ffffff';
                sofaColor = '#38bdf8';
              }

              const handleTableClick = (e) => {
                e.stopPropagation();
                // Если пользователь перемещал схему за стол (drag), не выбираем стол
                if (hasMovedRef.current) {
                  hasMovedRef.current = false;
                  return;
                }
                if (isOccupied) return;
                onSelectTable(t);
              };

              const label = t.number;

              if (t.shape === 'circle') {
                return (
                  <g
                    key={t.number}
                    onClick={handleTableClick}
                    className={`${styles.tableGroup} ${isOccupied ? styles.tableOccupied : styles.tableAvailable} ${isSelected ? styles.tableSelectedGlow : ''}`}
                  >
                    {/* Анимированный контур подсветки активного стола */}
                    {isSelected && (
                      <circle
                        cx={t.cx}
                        cy={t.cy}
                        r={t.r + 3.5}
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className={styles.pulseRing}
                      />
                    )}

                    {/* Кресла вокруг круглого стола */}
                    <circle cx={t.cx} cy={t.cy - t.r - 3} r="3" fill={sofaColor} opacity="0.85" />
                    <circle cx={t.cx} cy={t.cy + t.r + 3} r="3" fill={sofaColor} opacity="0.85" />
                    <circle cx={t.cx - t.r - 3} cy={t.cy} r="3" fill={sofaColor} opacity="0.85" />
                    <circle cx={t.cx + t.r + 3} cy={t.cy} r="3" fill={sofaColor} opacity="0.85" />

                    {/* Столешница */}
                    <circle
                      cx={t.cx}
                      cy={t.cy}
                      r={t.r}
                      fill={mainColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? '2' : '1.5'}
                    />
                    <text
                      x={t.cx}
                      y={t.cy + 3.5}
                      fill={textColor}
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {label}
                    </text>
                  </g>
                );
              }

              return (
                <g
                  key={t.number}
                  onClick={handleTableClick}
                  className={`${styles.tableGroup} ${isOccupied ? styles.tableOccupied : styles.tableAvailable} ${isSelected ? styles.tableSelectedGlow : ''}`}
                >
                  {/* Анимированный контур подсветки активного стола */}
                  {isSelected && (
                    <rect
                      x={t.x - 2.5}
                      y={t.y - 2.5}
                      width={t.w + 5}
                      height={t.h + 5}
                      rx="5"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className={styles.pulseRing}
                    />
                  )}

                  {/* Диванчики сверху и снизу (Restoplace style) */}
                  <rect
                    x={t.x + 2}
                    y={t.y - 3}
                    width={t.w - 4}
                    height="2.5"
                    rx="1"
                    fill={sofaColor}
                    opacity="0.85"
                  />
                  <rect
                    x={t.x + 2}
                    y={t.y + t.h + 0.5}
                    width={t.w - 4}
                    height="2.5"
                    rx="1"
                    fill={sofaColor}
                    opacity="0.85"
                  />

                  {/* Основной стол */}
                  <rect
                    x={t.x}
                    y={t.y}
                    width={t.w}
                    height={t.h}
                    rx="3"
                    fill={mainColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? '2' : '1.5'}
                  />
                  <text
                    x={t.x + t.w / 2}
                    y={t.y + t.h / 2 + 3.5}
                    fill={textColor}
                    fontSize="9"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FloorMap;
