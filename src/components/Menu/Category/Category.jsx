import React, { useContext } from 'react';
import style from './Category.module.css';
import Context from '../../../Context/Context';
import { categories } from '../../../core/model/Categories';

const Category = ({ setCategoryUse, categoryUse }) => {
  const { switchMenuMode } = useContext(Context);

  const changeCategory = (categoryName) => {
    categoryUse === categoryName ? setCategoryUse(null) : setCategoryUse(categoryName);
  };
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        {categories.map((category) => {
          if (category.places === 'all' || category.places === switchMenuMode) {
            return (
              <button
                key={category.id}
                onClick={() => changeCategory(category.name)}
                className={categoryUse === category.name ? style.category__item_active : style.category__item}
              >
                <div className={style.category__item_btn}>{category.title}</div>
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Category;
