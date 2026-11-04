import React, { memo } from 'react';
import style from './Category.module.css';

const Category = memo(({ activeId, activeCategories = [], onSelectCategory }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
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
