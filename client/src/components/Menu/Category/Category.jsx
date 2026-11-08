import React, { memo, useEffect, useRef } from 'react';
import style from './Category.module.css';

const Category = memo(({ activeId, activeCategories = [], onSelectCategory }) => {
  const containerRef = useRef(null);

  // На мобильных устройствах центрируем активный таб в горизонтальной полосе
  useEffect(() => {
    if (!containerRef.current) return;
    const activeButton = containerRef.current.querySelector(`.${style.category__item_active}`);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeId]);

  return (
    <div className={style.wrapper}>
      <div className={style.category} ref={containerRef}>
        {activeCategories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onSelectCategory(id)}
            className={activeId === id ? style.category__item_active : style.category__item}
          >
            <span className={style.category__item_text}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
