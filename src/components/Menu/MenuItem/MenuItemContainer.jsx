import React, { useContext, useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import Context from "../../../Context/Context";

const MenuItemContainer = ({ item }) => {
  const value = useContext(Context);
  const {addToOrder} = value

  
  return <MenuItem item={item} addToOrder={addToOrder} remove={value.removeToOrder} />;
};

export default MenuItemContainer;
