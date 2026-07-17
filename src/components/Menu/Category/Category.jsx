import React, { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import style from './Category.module.css';

const Category = memo(() => {
  const location = useLocation();
  const isAroma = location.pathname.includes('/aroma/menu');
  const categories = isAroma ? CATEGORIES.aroma : CATEGORIES.gusto;
 
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        {categories.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
            end
          >
            <button className={style.category__item_btn}>
              <h2>{label}</h2>
            </button>
          </NavLink>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
