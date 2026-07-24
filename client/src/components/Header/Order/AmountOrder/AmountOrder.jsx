import React from 'react';
import styles from './AmountOrder.module.css';

const AmountOrder = ({ amount }) => {
  return (
    <div className={styles.amount}>
      <p>Итого: {0 || amount} ₽</p>
    </div>
  );
};

export default AmountOrder;
