import React from 'react';
import { useAppStore, selectOrderAmount } from '../../store';
import Header from './Header';

const HeaderContainer = () => {
  const amount = useAppStore(selectOrderAmount);
  const deleteOrder = useAppStore((s) => s.deleteOrder);

  return <Header amount={amount} deleteOrder={deleteOrder} />;
};

export default HeaderContainer;
