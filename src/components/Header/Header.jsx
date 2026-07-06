import React, { useCallback } from 'react';
import style from './Header.module.css';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo/Logo';
import { useMenuStore } from '../../store/useMenuStore';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = useMenuStore((state) => state.amount);
  const deleteOrder = useMenuStore((state) => state.deleteOrder);

  const confirmX = useCallback(() => {
    if (amount > 0) {
      alert('Для перехода в главное меню очистите корзину');
      const result = confirm('Очистить корзину?');
      if (result) {
        deleteOrder();
        navigate('/');
      }
    } else navigate('/');
  }, [amount, deleteOrder, navigate]);

  const isHomePage = location.pathname === '/';

  return (
    <header className={`${style.header} ${isHomePage ? style.header_black : ''}`}>
      <Logo confirmX={confirmX} />

      <nav className={style.header__nav}>
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
