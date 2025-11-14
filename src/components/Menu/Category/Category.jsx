// import React, { useContext } from 'react';
// import { NavLink } from 'react-router-dom';
// import style from './Category.module.css';
// import Context from '../../../Context/Context';

// const Category = () => {
//   const { switchMenuMode } = useContext(Context);
//   return (
//     <div className={style.wrapper}>
//       <div className={style.category}>
//         {switchMenuMode === false ? (
//           <NavLink
//             to={'./poke'}
//             className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//           >
//             <button className={style.category__item_btn}>
//               <h1>Поке</h1>
//             </button>
//           </NavLink>
//         ) : null}
//         <NavLink
//           to={'./salads'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Салаты</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./pastes'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Пасты</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./snacks'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Закуски</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./hotDish'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Горячее</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./soup'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Супы</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./desserts'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Десерты</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./milkshake'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Молочные коктейли</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./smoothie'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Смузи</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./coffee'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Кофе</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./tea'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Чай</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./lemonades'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Лимонады</h1>
//           </button>
//         </NavLink>

//         <NavLink
//           to={'./nonalco'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Напитки безалкогольные</h1>
//           </button>
//         </NavLink>
//         <NavLink
//           to={'./alco'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Напитки алкогольные</h1>
//           </button>
//         </NavLink>

//         <NavLink
//           to={'./coctail'}
//           className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
//         >
//           <button className={style.category__item_btn}>
//             <h1>Коктейли</h1>
//           </button>
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Category;

import React, { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import style from './Category.module.css';

const CATEGORIES = {
  gusto: [
    { to: '/gusto/menu', label: 'Полное меню' },
    { to: 'salads', label: 'Салаты' },
    { to: 'poke', label: 'Поке' },
    { to: 'pasta', label: 'Пасты' },
    { to: 'snacks', label: 'Закуски' },
    { to: 'hotDish', label: 'Горячее' },
    { to: 'soup', label: 'Супы' },
    { to: 'desserts', label: 'Десерты' },
    { to: 'iceCream', label: 'Мороженое' },
    { to: 'milkshake', label: 'Молочные коктейли' },
    { to: 'smoothie', label: 'Смузи' },
    { to: 'coffee', label: 'Кофе' },
    { to: 'tea', label: 'Чай' },
    { to: 'lemonade', label: 'Лимонады' },
    { to: 'drink', label: 'Напитки безалкогольные' },
    { to: 'alcohol', label: 'Напитки алкогольные' },
    { to: 'coctail', label: 'Коктейли' },
  ],
  aroma: [
    { to: '/aroma/menu', label: 'Полное меню' },
    { to: 'salads', label: 'Салаты' },
    { to: 'pasta', label: 'Пасты' },
    { to: 'snacks', label: 'Закуски' },
    { to: 'hotDish', label: 'Горячее' },
    { to: 'soup', label: 'Супы' },
    { to: 'desserts', label: 'Десерты' },
    { to: 'milkshake', label: 'Молочные коктейли' },
    { to: 'smoothie', label: 'Смузи' },
    { to: 'coffee', label: 'Кофе' },
    { to: 'tea', label: 'Чай' },
    { to: 'lemonade', label: 'Лимонады' },
    { to: 'drink', label: 'Напитки безалкогольные' },
    { to: 'alcohol', label: 'Напитки алкогольные' },
    { to: 'coctail', label: 'Коктейли' },
  ],
};

const Category = memo(() => {
  const location = useLocation();
  const isAroma = location.pathname.includes('/aroma/menu');
  const categories = isAroma ? CATEGORIES.aroma : CATEGORIES.gusto;

  return (
    <div className={style.wrapper}>
      <div className={style.category}>
        {categories.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? style.category__item_active : style.category__item)}
            end
          >
            <button className={style.category__item_btn}>
              <h1>{label}</h1>
            </button>
          </NavLink>
        ))}
      </div>
    </div>
  );
});

Category.displayName = 'Category';
export default Category;
