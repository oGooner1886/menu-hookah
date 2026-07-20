import React, { useMemo } from 'react';
import style from './Menu.module.css';
import { useStore, selectCurrentProducts, selectCurrentOrder } from '../../store/useStore';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';
import MenuSection from './MenuSection/MenuSection';

const Menu = () => {
  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);
  const item = useStore((state) => state.item);
  const setItem = useStore((state) => state.setItem);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);

  const groupedItems = useMemo(() => {
    const groups = {};
    if (!currentProducts) return groups;
    currentProducts.forEach((product) => {
      let cat = product.category || 'other';
      if (cat === 'lightSnacks') cat = 'snacks';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return groups;
  }, [currentProducts]);

  const categoryKeys = Object.keys(groupedItems);

  return (
    <div className={style.wrapper}>
      <Category />
      <div className={style.item__wrapper}>
        {categoryKeys.length > 0 ? (
          categoryKeys.map((catKey) => (
            <MenuSection
              key={catKey}
              categoryId={catKey}
              items={groupedItems[catKey]}
              order={order}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
              setItem={setItem}
            />
          ))
        ) : (
          <p>Товары не найдены</p>
        )}

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
