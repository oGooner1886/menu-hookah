import React from 'react';
import style from './ItemEditions.module.scss';

const ItemEditions = ({ item, selectDiff, setActive }) => {
  const { subtitle, weight } = item;
  return (
    <div className={style.item__wrapper}>
      <button
        className={style.item__option}
        onClick={() => {
          selectDiff(item);
          setActive(true);
        }}
      >
        <div title={weight}>
          {subtitle}
          {weight}
        </div>
        {/* {difference && <span> +{difference} ₽</span>} */}
      </button>
    </div>
  );
};

export default ItemEditions;
