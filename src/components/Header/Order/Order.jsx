import styles from "./Order.module.css";

const Order = ({ item, totalPrice, portion, add, remove }) => {
  const { title, gallery, uid } = item;

  return (
    <div className={styles.order}>
      <div className={styles.order__list}>
        <div className={styles.order__item_wrapper}>
          <div className={styles.order__item}>
            <div className={styles.order__item_photo}>
              <img
                className={styles.order__item_img}
                src={"./images/menu" + gallery}
                alt=""
              />
            </div>
            <div className={styles.order__item_info}>
              <h2 className={styles.order__item_title}>{title}</h2>
              <div className={styles.order__item_options}>
                <div className={styles.order__counter}>
                  <button
                    className={styles.order__counter_button}
                    onClick={() => remove(uid)}
                  >
                    <span>-</span>
                  </button>
                  <p className={styles.order__counter_quantity}>
                    <span>{portion}</span>
                  </p>
                  <button
                    className={styles.order__counter_button}
                    onClick={() => add(uid)}
                  >
                    <span>+</span>
                  </button>
                </div>
                <div className={styles.order__price}>
                  <p>{totalPrice}₽</p>
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
