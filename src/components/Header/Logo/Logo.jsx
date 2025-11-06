import React from 'react';
import logo from '../../../assets/images/favicon.png';
import style from '../Header.module.css';


// eslint-disable-next-line react/display-name
const Logo = ({ confirmX  }) => {
  return (
    <a onClick={confirmX}>
      <img className={style.header__logo} src={logo} alt="GustoLounge" />
    </a>
  );
};

export default Logo;
