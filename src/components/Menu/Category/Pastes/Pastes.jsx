import React, { useContext } from "react";
import style from "../../Menu.module.css";
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Pastes = ({openModalForEdit}) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let pastes = products.filter((item) => item.uid >= 100 && item.uid < 199);
  return (
    <div className={style.wrapper}>
      {pastes.map((item) => (
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

export default Pastes;
