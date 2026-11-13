import React from 'react';
import styles from './TableView.module.css';
import { GUSTO_TABLES } from '../../../config/gustoTables';

const TableView = ({
  selectedTable,
  onSelectTable,
  occupiedTableNumbers = [],
  liveOccupiedTables = [],
  activeHall,
}) => {
  // Номера столов, где сейчас сидят гости
  const liveNumbers = liveOccupiedTables.map((item) => String(item.tableNumber));

  // Фильтрация по залу
  const filteredTables = GUSTO_TABLES.filter((t) => {
    if (activeHall === 'green') return t.sectionName === 'Зеленый';
    if (activeHall === 'second') return t.sectionName === 'Второй зал';
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {filteredTables.map((t) => {
          const isOccupied = occupiedTableNumbers.includes(String(t.number));
          const isLive = liveNumbers.includes(String(t.number));
          const isSelected = selectedTable && String(selectedTable.number) === String(t.number);

          return (
            <div
              key={t.number}
              onClick={() => !isOccupied && onSelectTable(t)}
              className={`${styles.card} ${
                isOccupied
                  ? styles.cardOccupied
                  : isSelected
                  ? styles.cardSelected
                  : styles.cardAvailable
              }`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.tableNameWrap}>
                  <span className={styles.tableNumberBadge}>{t.number}</span>
                  <strong className={styles.tableName}>{t.tableName}</strong>
                </div>

                {isOccupied ? (
                  <span className={styles.badgeOccupied}>
                    {isLive ? 'В заведении' : 'Занят'}
                  </span>
                ) : (
                  <span className={styles.badgeAvailable}>Свободен</span>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.hallName}>{t.sectionName}</div>
                <div className={styles.desc}>{t.description}</div>
                <div className={styles.capacity}>Вместимость: до {t.capacity} чел</div>
              </div>

              {!isOccupied && (
                <div className={styles.cardFooter}>
                  <span className={styles.depositLabel}>Депозит: 500 ₽</span>
                  <span className={styles.selectBtnText}>
                    {isSelected ? '✓ Выбран' : 'Выбрать стол'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TableView;

