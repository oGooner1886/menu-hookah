import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import style from './Category.module.css';
import Context from '../../../Context/Context';

const Category = () => {
  const { switchMenuMode } = useContext(Context);
  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        <NavLink
          to={'./salads'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Салаты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./soup'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Супы</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./hotDish'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Горячее</h1>
          </button>
        </NavLink>
        {switchMenuMode === true ? (
          <NavLink
            to={'./poke'}
            className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
          >
            <button className={style.category__item_btn}>
              <h1>Поке</h1>
            </button>
          </NavLink>
        ) : null}

        <NavLink
          to={'./snacks'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Закуски</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./pastes'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Пасты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./lemonades'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Лимонады</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./tea'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Чай</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./coffee'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Кофе</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./desserts'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Десерты</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./milkshake'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Молочные коктейли</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./smoothie'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Смузи</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./nonalco'}
          className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
        >
          <button className={style.category__item_btn}>
            <h1>Напитки безалкогольные</h1>
          </button>
        </NavLink>
        <NavLink
          to={'./alco'}
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
