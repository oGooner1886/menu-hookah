import React from "react";
import style from "./ItemEditions.module.css";

const ItemEditions = ({ item, selectDiff, active, setActive }) => {
  const { uid, subtitle, price, weight, difference } = item;

  
  return (
    <div className={style.item__wrapper}>
      <button
        className={style.item__option}
        // onClick={() => selectDiff(difference)}
        onClick={() => {
          selectDiff(item)
          setActive(true)
        }}
      >
        <div title={weight}>{subtitle}{weight}</div>
        {difference && <span> +{difference} ₽</span>}
      </button>
    </div>
  );
};

export default ItemEditions;
