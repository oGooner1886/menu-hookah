import React from 'react';
import style from './Footer.module.css';
import { NavLink } from 'react-router-dom';
import { BsTelegram, BsInstagram } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className={style.footer}>
      <div className={style.footer__desc}>follow along</div>
      <nav className={style.footer__nav}>
        <div className={style.footer__nav_item}>
          <NavLink to={'https://www.instagram.com/nua_astrakhan'} className={style}>
            <BsInstagram className={style.item} />
          </NavLink>
        </div>
        <div className={style.footer__nav_item}>
          <NavLink to={'https://www.t.me/nualounge'} className={style}>
            <BsTelegram className={style.item} />
          </NavLink>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
