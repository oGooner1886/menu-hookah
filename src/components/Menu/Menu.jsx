import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import style from './Menu.module.scss';
import MenuItem from './MenuItem/MenuItem';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';
import {
  useAppStore,
  selectCurrentProducts,
  selectOrder,
  selectEditingItem,
} from '../../store';

const Menu = () => {
  const currentProducts = useAppStore(selectCurrentProducts);
  const order = useAppStore(selectOrder);
  const addToOrder = useAppStore((s) => s.addToOrder);
  const removeFromOrder = useAppStore((s) => s.removeFromOrder);
  const editingItem = useAppStore(selectEditingItem);
  const setEditingItem = useAppStore((s) => s.setEditingItem);
  const { '*': currentCategory } = useParams();

  const groupedItems = useMemo(() => {
    const groups = {};
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
          openModalForEdit={setEditingItem}
        />
      );
    });
  }, [itemsToRender, order, addToOrder, removeFromOrder, setEditingItem]);

  return (
    <div className={style.wrapper}>
      <Category />
      <div className={style.item__wrapper}>
        {renderedItems.length > 0 ? renderedItems : <p>Товары не найдены</p>}
        {editingItem && (
          <ModalMenu
            item={editingItem}
            closeModalForEdit={() => setEditingItem(null)}
            portion={order[editingItem.uid] || 0}
            addToOrder={addToOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;
