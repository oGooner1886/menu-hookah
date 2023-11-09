import React, { useContext, useState } from "react";
 import MenuItemContainer from "./MenuItem/MenuItemContainer";
import style from "./Menu.module.css";
import Context from "../../Context/Context";
const Menu = () => {

    const value = useContext(Context)

  return (
  <div className={style.wrapper}>
    {
        value.quantity.map((item) => <MenuItemContainer key={item.uid} item={item}/>)
    }
  </div>
  )
};

export default Menu;
// "UID salads (1-99), UID pasta (100-199),
// UID lightSnacks (200-299), UID poke (300-399),
// UID hotDish (400-499), UID soup (500-599),
// UID snacks (600-699), UID desserts (700-799),
// UID iceCream (800-899), UID milkshake (900-999),
// UID smoothie (1000-1099), UID coffee (1100-1199),
// UID tea (1200-1299), UID lemonade (1300-1399),
// UID drink (1400-1499), UID alcohol (1500-1599),
// UID options (1600-1699)",
