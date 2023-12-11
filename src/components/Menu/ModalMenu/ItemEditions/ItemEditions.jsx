import React from "react";
import style from "./ItemEditions.module.css"

const ItemEditions = ({ item }) => {
  const { uid, subtitle, price, weight, difference } = item;

  return (
    <div className={style.item__wrapper}>
        <div className={style.item__option}>{subtitle}</div>
      </div>
  );
};

export default ItemEditions;
