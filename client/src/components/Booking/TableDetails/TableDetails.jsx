import React from 'react';
import styles from './TableDetails.module.css';

const TableDetails = ({
  selectedTable,
  selectedDate,
  selectedTime,
  selectedGuests,
  onProceed,
}) => {
  if (!selectedTable) {
    return (
      <div className={styles.emptyContainer}>
        <span className={styles.emptyText}>
          Выберите свободный стол на интерактивной карте выше
        </span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.topInfo}>
        <div className={styles.mainInfo}>
          <div className={styles.titleWrap}>
            <h3 className={styles.tableTitle}>
              {selectedTable.tableName || `Стол №${selectedTable.number}`}
            </h3>
            <span className={styles.sectionBadge}>
              {selectedTable.sectionName || 'Gusto Lounge'}
            </span>
          </div>
          <div className={styles.tagsRow}>
            <span className={styles.tag}>Вместимость: до {selectedTable.capacity} чел</span>
            <span className={styles.tag}>{selectedTable.type}</span>
          </div>
          <p className={styles.description}>{selectedTable.description}</p>
        </div>

        <div className={styles.depositBox}>
          <div className={styles.depositAmount}>Депозит: 500 ₽</div>
          <div className={styles.depositNote}>Засчитывается в чек в заведении</div>
        </div>
      </div>

      <button
        type="button"
        onClick={onProceed}
        className={styles.proceedBtn}
      >
        <span>Забронировать {selectedTable.tableName} на {selectedTime}</span>
      </button>
    </div>
  );
};

export default TableDetails;

