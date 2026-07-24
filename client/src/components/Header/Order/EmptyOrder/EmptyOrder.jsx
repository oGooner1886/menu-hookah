import React from 'react';
import style from './EmptyOrder.module.css';
import { Link } from 'react-router-dom';
const EmptyOrder = ({ branch, branchName }) => {
  return (
    <div className={style.empty}>
      <p>Ваша корзина пуста</p>
      <Link to={`/${branch}/menu`} className={style.empty__link_button}>
        <button className={style.empty_button}>меню {branchName}</button>
      </Link>
    </div>
  );
};

export default EmptyOrder;
