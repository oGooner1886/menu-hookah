import React, { useState } from "react";
import style from "../../MainContent/CardTest/CardTest.module.css";
import styles from "./Order.module.css";

const Order = (props) => {
  console.log(props);

  const [count, setCount] = useState(0);

  const handleClickIncr = () => {
    setCount(count + 1);
  };
  const handleClickDecr = () => {
    count > 0 && setCount(count - 1);
  };

  return (
    <div className={styles.order}>
      <div className={styles.order__list}>
        <div>
          <p className={styles.order_disclaimer}>
            Обратитесь к персоналу, чтобы сделать заказ
          </p>
          <h2 className={styles.order__disclaimer_title}>Ваш заказ</h2>
        </div>
        <div className={styles.order__item_wrapper}>
          <div className={styles.order__item}>
            <div className={styles.order__item_photo}>
              <img
                className={styles.order__item_img}
                src={"./images/menu" + props.item.gallery}
                alt=""
              />
            </div>
            <div className={styles.order__item_info}>
              <h2 className={styles.order__item_title}>{props.item.title}</h2>
              <div className={styles.order__item_options}>
                <div className={styles.order__counter}>
                  <button
                    className={styles.order__counter_button}
                    onClick={() => handleClickDecr()}
                  >
                    <span>-</span>
                  </button>
                  <p className={styles.order__counter_quantity}>
                    <span>{count}</span>
                  </p>
                  <button
                    className={styles.order__counter_button}
                    onClick={() => {
                      handleClickIncr();
                    }}
                  >
                    <span>+</span>
                  </button>
                </div>
                <div className={styles.order__price}>
                  <p>{props.item.price}₽</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
