import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const HotDish = ({ openModalForEdit }) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  const hotDish = products.filter((item) => item.uid >= 400 && item.uid < 499);
  return (
    <div className={style.wrapper}>
      {hotDish.map((item) => (
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

export default HotDish;
