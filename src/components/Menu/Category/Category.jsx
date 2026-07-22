import React, { memo } from 'react';
import style from './Category.module.css';

const Category = memo(({ activeId, activeCategories = [], scrollToCategory }) => {
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        {activeCategories.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollToCategory(id)}
            className={activeId === id ? style.category__item_active : style.category__item}
          >
            {/* <button className={style.category__item_btn}> */}
            <span className={style.category__item_text}>{label}</span>
            {/* </button> */}
          </button>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
