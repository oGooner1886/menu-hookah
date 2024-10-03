import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from '../../../../Context/Context';
import MenuItem from '../../MenuItem/MenuItem';

const Alco = ({ openModalForEdit }) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  const alco = products.filter((item) => item.uid >= 1500 && item.uid < 1599);
  return (
    <div className={style.wrapper}>
      {alco.map((item) => (
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

export default Alco;
