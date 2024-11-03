import React, { useContext } from 'react';
import Context from '../../Context/Context';
import Header from './Header';

const HeaderContainer = () => {
  const value = useContext(Context);
  const { amount, deleteOrder } = value;
  return <Header amount={amount} deleteOrder={deleteOrder} />;
};

export default HeaderContainer;
