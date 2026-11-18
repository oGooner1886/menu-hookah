import React from 'react';
import styles from './Order.module.css';
import Placeholder from '../../../mocks/Placeholder/Placeholder';

const Order = ({ item, add, remove, totalPrice, portion }) => {
  const { title, parentTitle, gallery, subtitle, weight, price } = item;

  const displayTitle = parentTitle || title;
  const displaySubtitle = parentTitle ? subtitle || title : subtitle;

  const imageSrc = gallery
    ? gallery.startsWith('/')
      ? `/images/menu${gallery}`
      : `/images/menu/${gallery}`
    : null;

  return (
    <div className={styles.itemCard}>
      <div className={styles.itemPhotoWrap}>
        {imageSrc ? (
          <img
            className={styles.itemImg}
            src={imageSrc}
            alt={displayTitle}
            loading="lazy"
          />
        ) : (
          <Placeholder />
        )}
      </div>

      <div className={styles.itemBody}>
        <div className={styles.itemInfo}>
          <h3 className={styles.itemTitle}>{displayTitle}</h3>

          {(displaySubtitle || weight) && (
            <div className={styles.variantBadge}>
              {displaySubtitle} {weight && weight !== displaySubtitle ? `• ${weight}` : ''}
            </div>
          )}

          <div className={styles.unitPrice}>{price} ₽ / шт</div>
        </div>

        <div className={styles.itemControls}>
          <div className={styles.stepper}>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={remove}
              aria-label="Уменьшить количество"
            >
              −
            </button>
            <span className={styles.stepperQty}>{portion}</span>
            <button
              type="button"
              className={styles.stepperBtn}
              onClick={add}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>

          <div className={styles.itemPriceTotal}>{totalPrice} ₽</div>
        </div>
      </div>
    </div>
  );
};

export default Order;
