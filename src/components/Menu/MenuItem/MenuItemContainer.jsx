import React, { useContext } from 'react';
import MenuItem from './MenuItem';
import Context from '../../../Context/Context';

const MenuItemContainer = ({ item }) => {
  const value = useContext(Context);
  const { addToOrder, removeToOrder } = value;

  return <MenuItem item={item} addToOrder={addToOrder} remove={removeToOrder} />;
};

export default MenuItemContainer;
