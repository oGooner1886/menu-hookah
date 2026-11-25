import React, { useCallback } from 'react';
import style from './Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';

const Header = ({
  amount,
  deleteOrder,
  currentBranch,
  tableNumber,
  user,
  loyaltyProfile,
  onOpenLoyalty,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isBookingPage = location.pathname.includes('/booking');

  const confirmX = useCallback(() => {
    if (amount > 0) {
      const result = window.confirm('В корзине есть товары. Очистить корзину для перехода в главное меню?');
      if (result) {
        deleteOrder();
        navigate('/');
      }
    } else navigate('/');
  }, [amount, deleteOrder, navigate]);

  if (isBookingPage) return null;

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
        </div>
        <div className={style.header__nav_item}>
          <NavLink
            to={'/gusto/menu'}
            className={({ isActive }) => (isActive ? style.header__nav_active : style.header__nav_item)}
          >
            Меню
          </NavLink>
        </div> 
        <div className={style.header__nav_item}>
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
        {!isHomePage && currentBranch && (
          <div className={style.header__nav_item}>
            <div className={style.header_infoBlock}>
              {tableNumber && (
                <div className={style.header_tableBadge}>
                  Стол {tableNumber}
                </div>
              )}

              {/* Кнопка Личного кабинета и бонусов Gusto Club */}
              <button
                type="button"
                className={
                  user || loyaltyProfile ? style.header_loyaltyBtnActive : style.header_loyaltyBtn
                }
                onClick={onOpenLoyalty}
                title="Личный кабинет и бонусная карта Gusto"
              >
                {user || loyaltyProfile ? (
                  <>
                    <span className={style.loyaltyBalanceDot} />
                    <span>
                      {Number(loyaltyProfile?.balance || 0).toLocaleString('ru-RU')} Б
                    </span>
                    <span className={style.loyaltyPercentTag}>
                      {loyaltyProfile?.cashbackPercent || 10}%
                    </span>
                  </>
                ) : (
                  <span>Бонусы • Войти</span>
                )}
              </button>

              <NavLink to={`/${currentBranch}/order`} className={style.header_cartLink}>
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
