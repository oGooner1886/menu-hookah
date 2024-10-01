import React from 'react';
import style from './Promo.module.css';
import logo from '../../assets/images/gusto lounge logo-1.png';
import logo_aroma from '../../assets/images/aroma_logo-1.png';

import { NavLink } from 'react-router-dom';

const Promo = () => {
  return (
    <div className={style.promo}>
      <div className={style.layer}>Выберите заведение</div>
      <div className={style.cards}>
        <div className={style.card__gusto}>
          <div className={`${style.card__gusto_cover}  ${style.logo__a}`}>
            <span className={style.card__gusto_price}>
              79h
              <img className={style.card__gusto_logo} src={logo} alt="" />
            </span>
            <div className={style.card__gusto_back}>
              <NavLink to={'/gusto/menu'}>Перейти к меню</NavLink>
            </div>
          </div>
        </div>
        <div className={style.card__gusto}>
          <div className={`${style.card__gusto_cover}  ${style.logo__b}`}>
            <span className={style.card__gusto_price}>
              <img className={style.card__gusto_logo} src={logo_aroma} alt="" />
            </span>
            <div className={style.card__gusto_back}>
              {/* <NavLink></NavLink> */}
              <a href="#">Перейти к меню</a>
            </div>
          </div>
        </div>

        {/* <div className={style.cards_vertical}></div> */}
        <div className={style.card__aroma}></div>
      </div>
    </div>
  );
};

export default Promo;

/*
<div class="card">
				<div class="cover item-a">
					<h1>Little<br>Bonsai</h1>
					<span class="price">$79</span>
					<div class="card-back">
						<a href="#">Add to cart</a>
						<a href="#">View detail</a>
					</div>
				</div>
         */
