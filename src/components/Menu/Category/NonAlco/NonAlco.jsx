import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const NonAlco = ({openModalForEdit}) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let drink = products.filter((item) => item.uid >= 1400 && item.uid < 1499);
  return (
    <div className={style.wrapper}>
      {drink.map((item) => (
        <MenuItem
          key={item.uid}
          item={item}
          portion={order[item.uid] || 0}
          addToOrder={addToOrder}
          removeFromOrder={removeFromOrder}
          openModalForEdit={openModalForEdit}
        />
      ))}
    </div>
  );
};

export default NonAlco;
