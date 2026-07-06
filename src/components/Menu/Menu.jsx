import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import style from './Menu.module.css';
import MenuItem from './MenuItem/MenuItem';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';
import { useMenuStore, selectCurrentProducts } from '../../store/useMenuStore';

const Menu = () => {
  const currentProducts = useMenuStore(selectCurrentProducts);
  const order = useMenuStore((state) => state.order);
  const addToOrder = useMenuStore((state) => state.addToOrder);
  const removeFromOrder = useMenuStore((state) => state.removeFromOrder);
  const item = useMenuStore((state) => state.item);
  const setItem = useMenuStore((state) => state.setItem);
  const isLoading = useMenuStore((state) => state.isLoading);

  const { '*': currentCategory } = useParams();

  const groupedItems = useMemo(() => {
    const groups = {};
    currentProducts.forEach((product) => {
      let cat = product.category || 'other';
      if (cat === 'lightSnacks') {
        cat = 'snacks';
      }

      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });

    return groups;
  }, [currentProducts]);

  const itemsToRender = currentCategory ? groupedItems[currentCategory] || [] : currentProducts;

  const renderedItems = useMemo(() => {
    return itemsToRender.map((product) => {
      const portion = product.editions
        ? product.editions.reduce((sum, ed) => sum + (order[ed.uid] || 0), 0)
        : order[product.uid] || 0;

      return (
        <MenuItem
          key={product.uid}
          item={product}
          portion={portion}
          addToOrder={addToOrder}
          removeFromOrder={removeFromOrder}
          openModalForEdit={setItem}
        />
      );
    });
  }, [itemsToRender, order, addToOrder, removeFromOrder, setItem]);

  if (isLoading) {
    return <div className={style.wrapper}>Загрузка меню...</div>;
  }

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
