import React from 'react';
import style from './EmptyOrder.module.css';
import { Link } from 'react-router-dom';
import { BsArrowLeft, BsCartX } from 'react-icons/bs';

const EmptyOrder = ({ branch, branchName }) => {
  return (
    <div className={style.emptyContainer}>
      <div className={style.iconWrap}>
        <BsCartX className={style.emptyIcon} />
      </div>

      <h2 className={style.emptyTitle}>В корзине пока пусто</h2>
      <p className={style.emptySubtitle}>
        Выберите понравившиеся блюда и напитки в меню заведения, чтобы сделать заказ.
      </p>

      <Link to={`/${branch}/menu`} className={style.menuLink}>
        <BsArrowLeft className={style.btnArrow} />
        <span>Перейти в меню {branchName}</span>
      </Link>
    </div>
  );
};

export default EmptyOrder;
