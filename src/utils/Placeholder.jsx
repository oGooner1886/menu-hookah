import React from 'react';
import placeholder from '../assets/images/gusto lounge logo-1.png';
import style from './Placeholder.module.css';
const Placeholder = () => {
  return (
    <div className={style.placeholder}>
      <img src={placeholder} alt="" />
    </div>
  );
};

export default Placeholder;
