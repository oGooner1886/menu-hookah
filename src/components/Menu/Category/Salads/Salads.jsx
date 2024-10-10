import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Salads = ({ openModalForEdit }) => {
  const { products, products_aroma, order, addToOrder, removeFromOrder, switchMenuMode } = useContext(Context);
  const salads = products.filter((item) => item.uid < 100);
  const salads_aroma = products_aroma.filter((item) => item.uid < 100);

  return (
    <div className={style.wrapper}>
      {switchMenuMode === true
        ? salads.map((item) => (
            <MenuItem
              key={item.uid}
              item={item}
              portion={order[item.uid] || 0}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
              openModalForEdit={openModalForEdit}
            />
          ))
        : salads_aroma.map((item) => (
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

export default Salads;
