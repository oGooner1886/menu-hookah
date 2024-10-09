import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const HotDish = ({ openModalForEdit }) => {
<<<<<<< HEAD
  const { products, products_aroma, order, addToOrder, removeFromOrder, switchMenuMode } = useContext(Context);
  const hotDish = products.filter((item) => item.uid >= 400 && item.uid < 499);
  const hotDish_aroma = products_aroma.filter((item) => item.uid >= 400 && item.uid < 499);

=======
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  const hotDish = products.filter((item) => item.uid >= 400 && item.uid < 499);
>>>>>>> a45413ac9f1528c4b72ec4f3556c9d5ee4f709b6
  return (
    <div className={style.wrapper}>
      {switchMenuMode === true
        ? hotDish.map((item) => (
            <MenuItem
              key={item.uid}
              item={item}
              portion={order[item.uid] || 0}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
              openModalForEdit={openModalForEdit}
            />
          ))
        : hotDish_aroma.map((item) => (
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
