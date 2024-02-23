import React from 'react';
import { NavLink } from 'react-router-dom';
import style from './Category.module.css';

const Category = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        <NavLink
          to={'/menu/salads'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Салаты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/soup'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Супы</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/hotDish'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Горячее</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/poke'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Поке</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/snacks'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Закуски</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/pastes'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Пасты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/lemonades'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Лимонады</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/tea'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Чай</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/coffee'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Кофе</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/desserts'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Десерты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/milkshake'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Молочные коктейли</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/smoothie'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Смузи</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/nonalco'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Напитки безалкогольные</h1>
          </button>
        </NavLink>
        <NavLink
          to={'/menu/alco'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Напитки алкогольные</h1>
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Category;
