import React, { useContext, useState } from 'react';
import style from './Menu.module.css';
import Context from '../../Context/Context';
import MenuItem from './MenuItem/MenuItem';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';

const Menu = () => {
  const { products, products_aroma, order, addToOrder, removeFromOrder, item, setItem, switchMenuMode } =
    useContext(Context);

  const closeModalForEdit = () => {
    setItem(null);
  };

  const [categoryUse, setCategoryUse] = useState(null);
  const placeProducts = switchMenuMode === 'Gusto' ? products : products_aroma;
  const categories = categoryUse ? placeProducts.filter((item) => item.category === categoryUse) : placeProducts;
  return (
    <div className={style.wrapper}>
      <div>
        <Category setCategoryUse={setCategoryUse} categoryUse={categoryUse} />
        <div className={style.item__wrapper}>
          {categories.map((item) => {
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
                openModalForEdit={setItem}
              />
            );
          })}
          {item && (
            <ModalMenu
              addToOrder={addToOrder}
              item={item}
              closeModalForEdit={closeModalForEdit}
              portion={order[item.uid] || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
/*
"UID salads (1-99), UID pasta (100-199),
UID lightSnacks (200-299), UID poke (300-399),
UID hotDish (400-499), UID soup (500-599),
UID snacks (600-699), UID desserts (700-799),
UID iceCream (800-899), UID milkshake (900-999),
UID smoothie (1000-1099), UID coffee (1100-1199),
UID tea (1200-1299), UID lemonade (1300-1399),
UID drink (1400-1499), UID alcohol (1500-1599),
UID options (1600-1699)",
 */
