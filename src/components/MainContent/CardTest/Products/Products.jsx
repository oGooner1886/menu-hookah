import React from "react";
import style from "../CardTest.module.css";

const Products = (props) => {
  return (
    <div  className={style.item}>
      
        <div className={style.desc}>
          <div className={style.desc__prop}>
            <h2 className={style.desc__title}>{props.item.title}</h2>
            <p className={style.desc__title_prop}>{props.item.description}</p>
          </div>
          <div className={style.desc__price}>
            <p className={style.desc__price_num}>{props.item.price}₽</p>
            <div className={style.desc__price_addToCart}>
              <button className={style.desc__price_button}>+</button>
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
