import React, { useContext, useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "../../../Context/Context";

const MenuItemContainer = ({ item, portion }) => {
  const value = useContext(Context);
  const {addToOrder, removeToOrder} = value


  return <MenuItem item={item} addToOrder={addToOrder} remove={removeToOrder} portion={portion} />;
};

export default MenuItemContainer;
