import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const NonAlco = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let smoothie = products.filter((item) => item.uid >= 1000 && item.uid < 1099);
  return (
    <div className={style.wrapper}>
      {smoothie.map((item) => (
        <MenuItem
          key={item.uid}
          item={item}
          portion={order[item.uid] || 0}
          addToOrder={addToOrder}
          removeFromOrder={removeFromOrder}
        />
      ))}
    </div>
  );
};

export default NonAlco;
