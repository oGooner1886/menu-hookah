import React from 'react';
import styles from './AmountOrder.module.css';

const AmountOrder = ({
  amount = 0,
  totalItems = 0,
  tableNumber,
  comment = '',
  setComment,
  onPlaceOrder,
  isSubmitting = false,
}) => {
  const isTableSet = Boolean(tableNumber);

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

        {/* Кнопка оформления заказа */}
        <button
          type="button"
          className={`${styles.submitBtn} ${!isTableSet ? styles.submitBtnDisabled : ''}`}
          onClick={onPlaceOrder}
          disabled={!isTableSet || isSubmitting}
        >
          {isSubmitting ? (
            <span className={styles.loaderWrap}>
              <span className={styles.spinner} />
              <span>Отправляем заказ...</span>
            </span>
          ) : isTableSet ? (
            <span>Отправить заказ на стол №{tableNumber} • {amount} ₽</span>
          ) : (
            <span>Отсканируйте QR-код на столе для заказа</span>
          )}
        </button>

        {!isTableSet && (
          <p className={styles.tableHint}>
            Для оформления заказа наведите камеру телефона на QR-код, расположенный на вашем столике.
          </p>
        )}
      </div>
    </div>
  );
};

export default AmountOrder;
