import React, { useContext } from "react";


import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Tea = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let tea = products.filter((item) => item.uid >= 1200 && item.uid < 1299);
  return (
    <div className={style.wrapper}>
      {tea.map((item) => (
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

export default Tea;
