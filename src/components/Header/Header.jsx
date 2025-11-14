import React, { useCallback } from 'react';
// import logo from '../../assets/images/favicon.png';
import style from './Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';

const Header = ({ amount, deleteOrder }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const confirmX = useCallback(() => {
    if (amount > 0) {
      alert('Для перехода в главное меню очистите корзину');
      const result = confirm('Очистить корзину?');
      if (result) {
        deleteOrder();
        navigate('/');
      }
    } else navigate('/');
  }, [deleteOrder, navigate]);
  const isHomePage = location.pathname === '/';

  return (
    <header className={`${style.header} ${isHomePage ? style.header_black : ''}`}>
      <Logo confirmX={confirmX} />

      <nav className={style.header__nav}>
        {/* <div className={style.header__nav_item}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? style.header__nav_active : style.header__nav_item
            }
          >
            Home
          </NavLink>
        </div> */}
        {/* <div className={style.header__nav_item}>
          <NavLink
            to={'/gusto/menu'}
            className={({ isActive }) => (isActive ? style.header__nav_active : style.header__nav_item)}
          >
            Меню
          </NavLink>
        </div> */}
        {/* <div className={style.header__nav_item}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? style.header__nav_active : style.header__nav_item
            }
          >
            Местоположение
          </NavLink>
        </div>
        <div className={style.header__nav_item}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? style.header__nav_active : style.header__nav_item
            }
          >
            Интерьер
          </NavLink>
        </div>
        <div className={style.header__nav_item}>
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive ? style.header__nav_active : style.header__nav_item
            }
          >
            О нас
          </NavLink>
        </div> */}
        {!isHomePage && (
          <div className={style.header__nav_item}>
            <div className={style.header_infoBlock}>
              <NavLink to={'/order'} className={style.header_cartLink}>
                <div className={style.header_cartWrapper} title="Корзина">
                  Заказ / {amount} ₽
                </div>
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
