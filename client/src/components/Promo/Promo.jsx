import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Promo.module.css';
import logoGusto from '../../assets/images/gusto lounge logo-1.png';
import logoAroma from '../../assets/images/aroma_logo-1.png';
import bgHookah from '../../assets/images/307.webp';
import { BRANCHES, useStore } from '../../store/useStore';

const Promo = () => {
  const navigate = useNavigate();
  const setBranch = useStore((state) => state.setBranch);

  const handleSelectBranch = (branchConst, route) => {
    setBranch(branchConst);
    navigate(route);
  };

  return (
    <div className={style.promo}>
      <div className={style.background} style={{ backgroundImage: `url(${bgHookah})` }} />
      <div className={style.overlay} />
      <div className={style.content}>
        <h1 className={style.title}>Выберите заведение</h1>

        <div className={style.cardsGrid}>
          {/* Gusto Lounge Card */}
          <div className={style.card}>
            <div className={style.cardHeader}>
              <img src={logoGusto} alt="Gusto Lounge" className={style.logo} />
              <div className={style.cardTitleWrap}>
                <h2 className={style.cardTitle}>Gusto Lounge</h2>
                <span className={style.cardSubtitle}>Лаунж-бар • Кухня • Кальяны</span>
              </div>
            </div>
            <div className={style.cardActions}>
              <button
                type="button"
                onClick={() => handleSelectBranch(BRANCHES.GUSTO, '/gusto/menu')}
                className={style.btnAction}
              >
                <span>Меню</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectBranch(BRANCHES.GUSTO, '/gusto/booking')}
                className={`${style.btnAction} ${style.btnActionPrimary}`}
              >
                <span>Забронировать</span>
              </button>
            </div>
          </div>

          {/* Aroma Card */}
          <div className={style.card}>
            <div className={style.cardHeader}>
              <img src={logoAroma} alt="Aroma" className={style.logo} />
              <div className={style.cardTitleWrap}>
                <h2 className={style.cardTitle}>Aroma</h2>
                <span className={style.cardSubtitle}>Кальянный клуб • Бар</span>
              </div>
            </div>
            <div className={style.cardActions}>
              <button
                type="button"
                onClick={() => handleSelectBranch(BRANCHES.AROMA, '/aroma/menu')}
                className={style.btnAction}
              >
                <span>Меню</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectBranch(BRANCHES.AROMA, '/aroma/booking')}
                className={`${style.btnAction} ${style.btnActionPrimary}`}
              >
                <span>Забронировать</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promo;
