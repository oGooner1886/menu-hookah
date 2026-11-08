import React, { memo } from 'react';
import MenuItem from '../MenuItem/MenuItem';
import style from './MenuSection.module.css';

const MenuSection = memo(({ categoryId, categoryLabel, items, order, stopList = [], addToOrder, removeFromOrder, setItem, sectionRef }) => {
  return (
    <section id={categoryId} className={style.categorySection} ref={sectionRef}>
      {categoryLabel && <h2 className={style.sectionTitle}>{categoryLabel}</h2>}
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
              order={order}
              stopList={stopList}
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
