import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Promo.module.css';
import logoGusto from '../../assets/images/gusto lounge logo-1.png';
import logoAroma from '../../assets/images/aroma_logo-1.png';

import bgHookah from '../../assets/images/307.jpg';

const Promo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const images = [logoGusto, logoAroma, bgHookah];
    const preloadImages = () => {
      return Promise.all(
        images.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
          });
        }),
      );
    };
    preloadImages().then(() => setLoading(false));
  }, []);

  if(loading) {
    return (
      <div className={style.preloader}>
        <div className={style.spinner}></div>
      </div>
    )
  }

  return (
    <div className={style.promo}>
      <div className={style.background} style={{ backgroundImage: `url(${bgHookah})` }} />
      <div className={style.overlay} />
      <div className={style.content}>
        <h1 className={style.title}>Выберите заведение</h1>

        <div className={style.buttons}>
          <button onClick={() => navigate('/gusto/menu')} className={style.btn}>
            <img src={logoGusto} alt="Gusto" className={style.logo} />
            <span>Gusto Lounge</span>
          </button>

          <button onClick={() => navigate('/aroma/menu')} className={style.btn}>
            <img src={logoAroma} alt="Aroma" className={style.logo} />
            <span>Aroma</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Promo;
