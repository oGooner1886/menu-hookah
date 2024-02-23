import React, { useContext } from 'react';
import Context from '../../Context/Context';
import Header from './Header';

const HeaderContainer = () => {
  const value = useContext(Context);
  const { amount } = value;
  return <Header amount={amount} />;
};

export default HeaderContainer;
