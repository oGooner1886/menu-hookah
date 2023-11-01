import React from "react";
import logo from "../../assets/images/logoNua.jpg";
import style from "./Header.module.css";
import { NavLink } from "react-router-dom";

const Header = ({amount}) => {
  return (
    <header className={style.header}>
      <div>
        <img className={style.header__logo} src={logo} alt="" />
      </div>
      <nav className={style.header__nav}>
        <div className={style.header__nav_item}>
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
            to={"/menu"}
            className={({ isActive }) =>
              isActive ? style.header__nav_active : style.header__nav_item
            }
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
        </div>
        <div className={style.header__nav_item}>
          <div className={style.header_infoBlock}>
            <NavLink to={"/order"} className={style.header_cartLink}>
              <div className={style.header_cartWrapper} title="Корзина">
                Заказ / {amount} ₽
              </div>
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
