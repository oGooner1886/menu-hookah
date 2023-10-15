import React from 'react'
import logo from '../../assets/images/logoNua.jpg'
import style from './Header.module.css'

const Header = () => {
  return (
    <header>
      <img className={style.logo} src={logo} alt="" />
    </header>
  )
}

export default Header
