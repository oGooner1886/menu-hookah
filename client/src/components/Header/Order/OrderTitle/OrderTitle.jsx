import React from 'react';
import style from './OrderTitle.module.css';
import { BsArrowLeft } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const OrderTitle = ({ branchName, branch }) => {
  return (
    <div className={style.blockTitle}>
      <div className={style.empty}>
        <Link to={`/${branch}/menu`} className={style.empty__link}>
          <span className={style.link__backArrow}>
            <BsArrowLeft />
            <p className={style.link__description}>К меню</p>
          </span>
        </Link>
      </div>
      <div className={style.order}>
        <div>
          <p className={style.order_disclaimer}>Обратитесь к персоналу, чтобы сделать заказ</p>
          <h2 className={style.order__disclaimer_title}>Ваш заказ в {branchName}</h2>
        </div>
      </div>
    </div>
  );
};

export default OrderTitle;
