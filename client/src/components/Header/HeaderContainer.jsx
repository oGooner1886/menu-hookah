import React from 'react';
import Header from './Header';
import { useStore, selectCurrentAmount } from '../../store/useStore';

const HeaderContainer = () => {
  const amount = useStore(selectCurrentAmount);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const currentBranch = useStore((state) => state.branch);
  const tableNumber = useStore((state) => state.tableNumber);

  return (
    <Header
      amount={amount}
      deleteOrder={deleteOrder}
      currentBranch={currentBranch}
      tableNumber={tableNumber}
    />
  );
};

export default HeaderContainer;
