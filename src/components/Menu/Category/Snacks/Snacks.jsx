import React, { useContext } from 'react';
import style from '../../Menu.module.css';
import Context from './../../../../Context/Context';
import MenuItem from './../../MenuItem/MenuItem';

const Snacks = ({ openModalForEdit }) => {
  const { products, products_aroma, order, addToOrder, removeFromOrder, switchMenuMode } = useContext(Context);
  const snacks = products.filter((item) => (item.uid >= 200 && item.uid < 299) || (item.uid >= 600 && item.uid < 699));
  const snacks_aroma = products_aroma.filter((item) => item.uid >= 600 && item.uid < 699);
  return (
    <div className={style.wrapper}>
      {switchMenuMode === true
        ? snacks.map((item) => {
            let portion;
            if (item.editions) {
              portion = item.editions.map((el) => order[el.uid] || 0).reduce((sum, port) => sum + port, 0);
            } else {
              portion = order[item.uid];
            }
            return (
              <MenuItem
                key={item.uid}
                item={item}
                portion={portion || 0}
                addToOrder={addToOrder}
                removeFromOrder={removeFromOrder}
                openModalForEdit={openModalForEdit}
              />
            );
          })
        : snacks_aroma.map((item) => {
            let portion;
            if (item.editions) {
              portion = item.editions.map((el) => order[el.uid] || 0).reduce((sum, port) => sum + port, 0);
            } else {
              portion = order[item.uid];
            }
            return (
              <MenuItem
                key={item.uid}
                item={item}
                portion={portion || 0}
                addToOrder={addToOrder}
                removeFromOrder={removeFromOrder}
                openModalForEdit={openModalForEdit}
              />
            );
          })}
    </div>
  );
};

export default Snacks;
