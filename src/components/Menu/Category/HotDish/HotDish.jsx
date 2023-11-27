import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const HotDish = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let hotDish = products.filter((item) => item.uid >= 400 && item.uid < 499);
  return (
    <div className={style.wrapper}>
      {hotDish.map((item) => (
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

export default HotDish;
