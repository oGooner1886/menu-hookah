import React, { memo } from 'react';
import logo from '../../../assets/images/favicon.png';
import style from '../Header.module.css';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const Logo = memo(({ amount, onConfirmX }) => {
  return amount === 0 ? (
    <NavLink to={'/'}>
      <img className={style.header__logo} src={logo} alt="GustoLounge" />
    </NavLink>
  ) : (
    <a onClick={onConfirmX} style={{ cursor: 'pointer' }}>
      <img className={style.header__logo} src={logo} alt="GustoLounge" />
    </a>
  );
});

export default Logo;
