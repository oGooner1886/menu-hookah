import React from "react";
import style from "../Menu.module.css";
const MenuItem = ({ item, addToOrder, remove }) => {
  const { title, description, price, gallery, uid, portion } = item;
  return (
    <div className={style.item}>
      <div className={style.desc}>
        <div className={style.desc__prop}>
          <h2 className={style.desc__title}>{title}</h2>
          <p className={style.desc__title_prop}>{description}</p>
        </div>
        <div className={style.desc__price}>
          <p className={style.desc__price_num}>{price}₽</p>
          <div className={style.desc__price_addToCart}>
            <button
              className={style.desc__price_button}
              onClick={() => {
                remove(item, uid);
              }}
            >
              <span>-</span>
            </button>
            <p className={style.desc__price_quantity}>
              <span>{portion}</span>
            </p>
            <button
              className={style.desc__price_button}
              onClick={() => {
                addToOrder(item, uid);
              }}
            >
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
      <div className={style.images}>
        <img src={"./images/menu" + gallery} alt="" />
      </div>
    </div>
  );
};

export default MenuItem;
