import React from 'react';
import style from './OrderTitle.module.css';
import { BsArrowLeft } from 'react-icons/bs';
import { NavLink, useNavigate } from 'react-router-dom';

const OrderTitle = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className={style.blockTitle}>
      <div className={style.empty}>
        <NavLink onClick={() => goBack()} className={style.empty__link}>
          <span className={style.link__backArrow}>
            <BsArrowLeft />
            <p className={style.link__description}>К меню</p>
          </span>
        </NavLink>
      </div>
      <div className={style.order}>
        <div>
          <p className={style.order_disclaimer}>Обратитесь к персоналу, чтобы сделать заказ</p>
          <h2 className={style.order__disclaimer_title}>Ваш заказ</h2>
        </div>
      </div>
    </div>
  );
};

export default OrderTitle;
