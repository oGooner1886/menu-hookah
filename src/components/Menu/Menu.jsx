import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import style from './Menu.module.css';
import { useStore, selectCurrentProducts, selectCurrentOrder } from '../../store/useStore';
import MenuItem from './MenuItem/MenuItem';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';

//
const Menu = () => {
  const { '*': currentCategory } = useParams();
  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);

  const item = useStore((state) => state.item);
  const setItem = useStore((state) => state.setItem);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);

  const groupedItems = useMemo(() => {
    const groups = {};
    if (!currentProducts) return groups;
    currentProducts.forEach((item) => {
      let cat = item.category || 'other';
      if (cat === 'lightSnacks') {
        cat = 'snacks';
      }
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [currentProducts]);

  const itemsToRender = currentCategory ? groupedItems[currentCategory] || [] : currentProducts;

  const renderedItems = useMemo(() => {
    return itemsToRender.map((item) => {
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
    });
  }, [itemsToRender, order, addToOrder, removeFromOrder, setItem]);

  return (
    <div className={style.wrapper}>
      <Category />
      <div className={style.item__wrapper}>
        {renderedItems.length > 0 ? renderedItems : <p>Товары не найдены</p>}
        {item && (
          <ModalMenu
            item={item}
            closeModalForEdit={() => setItem(null)}
            portion={order[item.uid] || 0}
            addToOrder={addToOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;
