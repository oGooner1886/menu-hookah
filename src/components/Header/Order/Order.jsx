import styles from "./Order.module.css";
import OrderEditionsOption from "./OrderEditionsOption";
import OrderSauceOption from "./OrderSauceOption";

const Order = ({ item, add, remove, totalPrice, portion }) => {
  const { title, gallery, uid } = item;
  const sauce = item.sauce;
  const editions = item.editions

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
              {/* {item.sauce ? (
                <select>
                  {sauce.map((el) => {
                    return <OrderSauceOption key={el.uid} el={el} />;
                  })}
                </select>
              ) : (
                ""
              )}
              {item.editions ? (
                <select>
                  {editions.map((el) => {
                    return <OrderEditionsOption key={el.uid} el={el}/>;
                  })}
                </select>
              ) : (
                ""
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
