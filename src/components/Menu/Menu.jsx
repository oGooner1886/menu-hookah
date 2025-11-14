import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import style from './Menu.module.css';
import Context from '../../Context/Context';
import MenuItem from './MenuItem/MenuItem';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';

const MemoizedMenuItem = React.memo(MenuItem);

//
const Menu = () => {
  const { currentProducts, order, addToOrder, removeFromOrder, item, setItem } = useContext(Context);
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
        <MemoizedMenuItem
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
