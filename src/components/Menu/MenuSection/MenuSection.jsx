import React, { memo } from 'react';
import MenuItem from '../MenuItem/MenuItem';
import style from '../Menu.module.css';

const MenuSection = memo(({ categoryId, items, order, addToOrder, removeFromOrder, setItem }) => {
  if (!items || items.length === 0) return null;

  return (
    <section id={categoryId} className={style.categorySection} style={{ scrollMarginTop: '100px' }}>
      <div className={style.productsGrid}>
        {items.map((item) => {
          const portion = item.editions
            ? item.editions.reduce((sum, ed) => sum + (order[ed.uid] || 0), 0)
            : order[item.uid] || 0;
          return (
            <MenuItem
              key={item.uid}
              item={item}
              portion={portion}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
              openModalForEdit={setItem}
            />
          );
        })}
      </div>
    </section>
  );
});

export default MenuSection;
