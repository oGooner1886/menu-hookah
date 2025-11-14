// import React, { useContext } from 'react';
// import style from './Promo.module.css';
// import logo from '../../assets/images/gusto lounge logo-1.png';
// import logo_aroma from '../../assets/images/aroma_logo-1.png';
// // import bg from '../../assets/images/307.jpg';
// import { NavLink } from 'react-router-dom';
// import Context from '../../Context/Context';

// const Promo = () => {
//   const { switchMenuOnAroma, switchMenuOnGusto } = useContext(Context);
//   return (
//     <div className={style.promo}>
//       {/* <main className={style.main}> */}
//         {/* <picture>
//           <source srcSet={bg} media="(min-width: 600px)" />
//           <img src={bg} alt="main-background" style={style.main__bg} />
//         </picture> */}
//       {/* </main> */}
//       <div className={style.layer}>Выберите заведение</div>
//       <div className={style.cards}>
//         <div className={style.card__gusto}>
//           <div className={`${style.card__gusto_cover}  ${style.logo__a}`}>
//             <span className={style.card__gusto_price}>
//               <img className={style.card__gusto_logo} src={logo} alt="" />
//             </span>
//             <div className={style.card__gusto_back}>
//               <NavLink to={'/gusto/menu'} onClick={() => switchMenuOnGusto()}>
//                 Перейти к меню
//               </NavLink>
//             </div>
//           </div>
//         </div>
//         <div className={style.card__gusto}>
//           <div className={`${style.card__gusto_cover}  ${style.logo__b}`}>
//             <span className={style.card__gusto_price}>
//               <img className={style.card__gusto_logo} src={logo_aroma} alt="" />
//             </span>
//             <div className={style.card__gusto_back}>
//               <NavLink to={'/aroma/menu'} onClick={() => switchMenuOnAroma()}>
//                 Перейти к меню
//               </NavLink>
//             </div>
//           </div>
//         </div>
//         <div className={style.card__aroma}></div>
//       </div>
//     </div>
//   );
// };

// export default Promo;

// src/components/promo/Promo.jsx
// src/components/promo/Promo.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Promo.module.css';
import logoGusto from '../../assets/images/gusto lounge logo-1.png';
import logoAroma from '../../assets/images/aroma_logo-1.png';

// Выбери одно из фото (я взял первое — самое атмосферное)
import bgHookah from '../../assets/images/307.jpg'; // ← переименуй своё фото сюда

const Promo = () => {
  const navigate = useNavigate();

  return (
    <div className={style.promo}>
      {/* Фон — твоё фото */}
      <div className={style.background} style={{ backgroundImage: `url(${bgHookah})` }} />

      {/* Тёмный оверлей для читаемости */}
      <div className={style.overlay} />

      {/* Контент */}
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
