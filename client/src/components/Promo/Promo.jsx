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

        <div className={style.buttons}>
          <button onClick={() => handleSelectBranch(BRANCHES.GUSTO, './gusto/menu')} className={style.btn}>
            <img src={logoGusto} alt="Gusto Lounge" className={style.logo} />
            <span>Gusto Lounge</span>
          </button>

          <button onClick={() => handleSelectBranch(BRANCHES.AROMA, './aroma/menu')} className={style.btn}>
            <img src={logoAroma} alt="Aroma" className={style.logo} />
            <span>Aroma</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Promo;
