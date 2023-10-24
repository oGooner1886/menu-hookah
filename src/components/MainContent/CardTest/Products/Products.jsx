import React, { useState } from "react";
import style from "../CardTest.module.css";

const Products = (props) => {
  const [count, setCount] = useState(0);
  const [countPrice, setCountPrice] = useState(0)
  const addPriceToCart = () => {
    setCountPrice(countPrice + props.item.price)
  }
  const handleClickIncr = () => {
    setCount(count + 1);
  };
  const handleClickDecr = () => {
    count > 0 && setCount(count - 1);
  };
  return (
    <div className={style.item}>
      <div className={style.desc}>
        <div className={style.desc__prop}>
          <h2 className={style.desc__title}>{props.item.title}</h2>
          <p className={style.desc__title_prop}>{props.item.description}</p>
        </div>
        <div className={style.desc__price}>
          <p className={style.desc__price_num}>{props.item.price}₽</p>
          <div className={style.desc__price_addToCart}>
            <button
              className={style.desc__price_button}
              onClick={() => handleClickDecr()}
            >
              <span>-</span>
            </button>
            <p className={style.desc__price_quantity}>
              <span>{count}</span>
            </p>
            <button
              className={style.desc__price_button}
              onClick={() => {
                handleClickIncr()
                props.onAdd(props.item)
                addPriceToCart()
              }}
              // onClick={() => props.onAdd(props.item)}
            >
              <span>+</span>
            </button>
          </div>
        </div>
      </div>
      <div className={style.images}>
        <img src={"./images/menu" + props.item.gallery} alt="" />
      </div>
    </div>
  );
};

export default Products;
