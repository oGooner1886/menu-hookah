import React, { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import style from './Category.module.css';

const CATEGORIES = {
  gusto: [
    { to: '/gusto/menu', label: 'Полное меню' },
    { to: 'salads', label: 'Салаты' },
    { to: 'poke', label: 'Поке' },
    { to: 'pasta', label: 'Пасты' },
    { to: 'snacks', label: 'Закуски' },
    { to: 'hotDish', label: 'Горячее' },
    { to: 'soup', label: 'Супы' },
    { to: 'desserts', label: 'Десерты' },
    { to: 'iceCream', label: 'Мороженое' },
    { to: 'milkshake', label: 'Молочные коктейли' },
    { to: 'smoothie', label: 'Смузи' },
    { to: 'coffee', label: 'Кофе' },
    { to: 'tea', label: 'Чай' },
    { to: 'lemonade', label: 'Лимонады' },
    { to: 'drink', label: 'Напитки безалкогольные' },
    { to: 'alcohol', label: 'Напитки алкогольные' },
    { to: 'coctail', label: 'Коктейли' },
  ],
  aroma: [
    { to: '/aroma/menu', label: 'Полное меню' },
    { to: 'salads', label: 'Салаты' },
    { to: 'pasta', label: 'Пасты' },
    { to: 'snacks', label: 'Закуски' },
    { to: 'hotDish', label: 'Горячее' },
    { to: 'soup', label: 'Супы' },
    { to: 'desserts', label: 'Десерты' },
    { to: 'milkshake', label: 'Молочные коктейли' },
    { to: 'smoothie', label: 'Смузи' },
    { to: 'coffee', label: 'Кофе' },
    { to: 'tea', label: 'Чай' },
    { to: 'lemonade', label: 'Лимонады' },
    { to: 'drink', label: 'Напитки безалкогольные' },
    { to: 'alcohol', label: 'Напитки алкогольные' },
    { to: 'coctail', label: 'Коктейли' },
  ],
};

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
              <h1>{label}</h1>
            </button>
          </NavLink>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
