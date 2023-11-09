import React from "react";
import styles from "./AmountOrder.module.css"

const AmountOrder = ({amount}) => {
  return (
    <div className={styles.amount}>
      <p>Итого: {amount} ₽</p>
    </div>
  );
};

export default AmountOrder;
