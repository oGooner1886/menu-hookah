import React, { useContext, useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "../../../Context/Context";

const MenuItemContainer = ({ item }) => {
  const value = useContext(Context);
  const addToOrder = value.addToOrder
 
  return <MenuItem item={item} incr={value.incrQuantity} decr={value.decrQuantity} addToOrder={addToOrder} remove={value.removeToOrder}/>;
};

export default MenuItemContainer;
