import React from 'react';
import style from './EmptyOrder.module.css';
import { NavLink } from 'react-router-dom';
const EmptyOrder = () => {
  return (
    <div className={style.empty}>
      <p>Ваша корзина пуста</p>
      <NavLink to={'/menu'} className={style.empty__link_button}>
        <button className={style.empty_button}>меню</button>
      </NavLink>
    </div>
  );
};

export default EmptyOrder;
