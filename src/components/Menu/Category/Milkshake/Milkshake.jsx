import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Milkshake = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let milkshake = products.filter((item) => item.uid >= 900 && item.uid < 999);
  return (
    <div className={style.wrapper}>
      {milkshake.map((item) => (
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

export default Milkshake;
