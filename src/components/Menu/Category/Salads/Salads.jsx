import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Salads = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let salads = products.filter((item) => item.uid < 100);
  
  return (
    <div className={style.wrapper}>
      {salads.map((item) => (
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

export default Salads;
