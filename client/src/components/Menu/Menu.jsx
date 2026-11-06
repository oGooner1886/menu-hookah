import React, { useMemo } from 'react';
import style from './Menu.module.css';
import {
  useStore,
  selectCurrentProducts,
  selectCurrentOrder,
  BRANCHES,
} from '../../store/useStore';
import Category from './Category/Category';
import ModalMenu from './ModalMenu/ModalMenu';
import MenuSection from './MenuSection/MenuSection';
import { CATEGORIES_CONFIG } from './../../config/categories';
import { useCategoryScroll } from '../../utils/useCategoryScroll';

const Menu = () => {
  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);
  const item = useStore((state) => state.item);
  const setItem = useStore((state) => state.setItem);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);
  const branch = useStore((state) => state.branch);

  // Группируем продукты по category id и сортируем по алфавиту
  const groupedByCategory = useMemo(() => {
    const groups = {};
    if (!currentProducts) return groups;
    currentProducts.forEach((product) => {
      const cat = product.category || 'other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });

    // Сортируем внутри каждой категории по алфавиту
    Object.keys(groups).forEach((catId) => {
      groups[catId].sort((a, b) =>
        (a.title || '').localeCompare(b.title || '', 'ru', { sensitivity: 'base' }),
      );
    });

    return groups;
  }, [currentProducts]);

  // Только категории с товарами, в порядке CATEGORIES_CONFIG
  const activeCategories = useMemo(
    () =>
      CATEGORIES_CONFIG.filter(
        (cat) => cat.branches.includes(branch) && groupedByCategory[cat.id]?.length > 0,
      ),
    [branch, groupedByCategory],
  );

  const { activeId, scrollToCategory, registerSection } = useCategoryScroll(activeCategories);

  return (
    <div className={style.wrapper}>
      <Category
        activeId={activeId}
        activeCategories={activeCategories}
        onSelectCategory={scrollToCategory}
      />

      <div className={style.item__wrapper}>
        {activeCategories.length > 0 ? (
          activeCategories.map((cat) => (
            <MenuSection
              key={cat.id}
              categoryId={cat.id}
              categoryLabel={cat.label}
              items={groupedByCategory[cat.id]}
              order={order}
              addToOrder={addToOrder}
              removeFromOrder={removeFromOrder}
              setItem={setItem}
              sectionRef={registerSection(cat.id)}
            />
          ))
        ) : (
          <p>Товары не найдены</p>
        )}

        {item && (
          <ModalMenu
            item={item}
            closeModalForEdit={() => setItem(null)}
            order={order}
            addToOrder={addToOrder}
            removeFromOrder={removeFromOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;
