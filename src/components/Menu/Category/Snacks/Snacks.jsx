import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Snacks = ({openModalForEdit}) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let snacks = products.filter(
    (item) =>
      (item.uid >= 200 && item.uid < 299) || (item.uid >= 600 && item.uid < 699)
      // item.category === "lightSnacks" || item.category === "snacks"
  );
  return (
    <div className={style.wrapper}>
      {snacks.map((item) => (
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

export default Snacks;
