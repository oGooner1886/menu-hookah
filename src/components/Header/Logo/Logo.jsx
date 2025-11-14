import React from 'react';
import logo from '../../../assets/images/favicon.png';
import style from '../Header.module.css';

const Logo = ({ confirmX }) => {
  return (
    <div
      className={style.header__logoLink}
      onClick={confirmX}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          confirmX();
        }
      }}
      tabIndex={0}
      role="link"
      aria-label="Перейти на главную страницу"
    >
      <img className={style.header__logo} src={logo} alt="GustoLounge" />
    </div>
  );
};

export default Logo;
