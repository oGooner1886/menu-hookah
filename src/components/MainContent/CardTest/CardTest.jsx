import React from "react";
import style from "./CardTest.module.css";
const CardTest = (props) => {
  return (
    <div class={style.item}>
      <div class={style.desc}>
        <div class={style.desc__prop}>
          <h2 class={style.desc__title}>{props.item.title}</h2>
          <p class={style.desc__title_prop}>{props.item.descr}</p>
        </div>
        <div class={style.desc__price}>
          <p class={style.desc__price_num}>{props.item.price}₽</p>
          <div class={style.desc__price_addToCart}>
            <button class={style.desc__price_button}>+</button>
          </div>
        </div>
      </div>
      <div class={style.images}>
        <img src={"./images/menu" + props.item.gallery} alt="" />
      </div>
    </div>
  );
};

export default CardTest;
