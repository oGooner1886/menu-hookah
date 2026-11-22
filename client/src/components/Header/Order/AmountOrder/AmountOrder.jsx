import React from 'react';
import styles from './AmountOrder.module.css';

const AmountOrder = ({
  amount = 0,
  totalItems = 0,
  tableNumber,
  hasActiveBill = false,
  comment = '',
  setComment,
  onPlaceOrder,
  onScanQr,
  isSubmitting = false,
}) => {
  const isTableSet = Boolean(tableNumber);

  const handleActionClick = () => {
    if (isTableSet) {
      onPlaceOrder();
    } else if (onScanQr) {
      onScanQr();
    }
  };

  return (
    <div className={styles.summaryWrapper}>
      <div className={styles.summaryCard}>
        <h3 className={styles.cardHeader}>Детали заказа</h3>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>
            Позиции в чеке ({totalItems} {totalItems === 1 ? 'товар' : 'товара'})
          </span>
          <span className={styles.detailValue}>{amount} ₽</span>
        </div>

        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Подача к столу</span>
          <span className={styles.freeBadge}>Бесплатно</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого к оплате</span>
          <span className={styles.totalAmount}>{amount} ₽</span>
        </div>

        {/* Поле комментария для кухни и официанта */}
        <div className={styles.commentField}>
          <label className={styles.commentLabel} htmlFor="order-comment">
            Пожелания к подаче (необязательно):
          </label>
          <input
            id="order-comment"
            type="text"
            className={styles.commentInput}
            placeholder="Например: напитки подать сразу, стейк средней прожарки"
            value={comment}
            onChange={(e) => setComment && setComment(e.target.value)}
            maxLength={140}
          />
        </div>

        {/* Кнопка оформления заказа или сканирования QR стола */}
        <button
          type="button"
          className={styles.submitBtn}
          onClick={handleActionClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.loaderWrap}>
              <span className={styles.spinner} />
              <span>Отправляем заказ...</span>
            </span>
          ) : isTableSet ? (
            <span>
              {hasActiveBill ? 'Дозаказать' : 'Отправить заказ'} • Стол №{tableNumber} • {amount} ₽
            </span>
          ) : (
            <span>Сканировать QR стола • {amount} ₽</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default AmountOrder;
