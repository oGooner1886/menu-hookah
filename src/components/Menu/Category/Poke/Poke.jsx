import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Poke = ({ openModalForEdit }) => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  const poke = products.filter((item) => item.uid >= 300 && item.uid < 399);
  return (
    <div className={style.wrapper}>
      {poke.map((item) => (
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

export default Poke;
