import React, { useContext } from 'react';
import style from './Promo.module.css';
import logo from '../../assets/images/gusto lounge logo-1.png';
import logo_aroma from '../../assets/images/aroma_logo-1.png';
// import bg from '../../assets/images/307.jpg';
import { NavLink } from 'react-router-dom';
import Context from '../../Context/Context';

const Promo = () => {
  const { switchMenuOnAroma, switchMenuOnGusto } = useContext(Context);
  return (
    <div className={style.promo}>
      {/* <main className={style.main}> */}
        {/* <picture>
          <source srcSet={bg} media="(min-width: 600px)" />
          <img src={bg} alt="main-background" style={style.main__bg} />
        </picture> */}
      {/* </main> */}
      <div className={style.layer}>Выберите заведение</div>
      <div className={style.cards}>
        <div className={style.card__gusto}>
          <div className={`${style.card__gusto_cover}  ${style.logo__a}`}>
            <span className={style.card__gusto_price}>
              <img className={style.card__gusto_logo} src={logo} alt="" />
            </span>
            <div className={style.card__gusto_back}>
              <NavLink to={'/gusto/menu'} onClick={() => switchMenuOnGusto()}>
                Перейти к меню
              </NavLink>
            </div>
          </div>
        </div>
        <div className={style.card__gusto}>
          <div className={`${style.card__gusto_cover}  ${style.logo__b}`}>
            <span className={style.card__gusto_price}>
              <img className={style.card__gusto_logo} src={logo_aroma} alt="" />
            </span>
            <div className={style.card__gusto_back}>
              <NavLink to={'/aroma/menu'} onClick={() => switchMenuOnAroma()}>
                Перейти к меню
              </NavLink>
            </div>
          </div>
        </div>
        <div className={style.card__aroma}></div>
      </div>
    </div>
  );
};

export default Promo;
