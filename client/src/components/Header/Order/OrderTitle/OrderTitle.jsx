import React from 'react';
import style from './OrderTitle.module.css';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const OrderTitle = ({ branchName, branch, onClear, totalItems }) => {
  return (
    <div className={style.titleWrapper}>
      <div className={style.navBar}>
        <Link to={`/${branch}/menu`} className={style.backLink}>
          <BsArrowLeft className={style.backIcon} />
          <span>В меню</span>
        </Link>

        {totalItems > 0 && onClear && (
          <button
            type="button"
            className={style.clearBtn}
            onClick={onClear}
            title="Очистить корзину"
          >
            Очистить
          </button>
        )}
      </div>

      <div className={style.headlineRow}>
        <h1 className={style.title}>Ваш заказ</h1>
        <span className={style.branchBadge}>{branchName}</span>
      </div>
    </div>
  );
};

export default OrderTitle;
