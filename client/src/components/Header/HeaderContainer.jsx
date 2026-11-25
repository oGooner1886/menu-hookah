import React, { useEffect } from 'react';
import Header from './Header';
import LoyaltyModal from './LoyaltyModal/LoyaltyModal';
import { useStore, selectCurrentAmount } from '../../store/useStore';

const HeaderContainer = () => {
  const amount = useStore(selectCurrentAmount);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const currentBranch = useStore((state) => state.branch);
  const tableNumber = useStore((state) => state.tableNumber);
  const user = useStore((state) => state.user);
  const loyaltyProfile = useStore((state) => state.loyaltyProfile);
  const setLoyaltyModalOpen = useStore((state) => state.setLoyaltyModalOpen);
  const fetchLoyaltyProfile = useStore((state) => state.fetchLoyaltyProfile);

  // При загрузке приложения подтягиваем свежий бонусный баланс для авторизованного гостя
  useEffect(() => {
    if (user?.phone || loyaltyProfile?.phone) {
      fetchLoyaltyProfile();
    }
  }, [user?.phone, loyaltyProfile?.phone, fetchLoyaltyProfile]);

  return (
    <>
      <Header
        amount={amount}
        deleteOrder={deleteOrder}
        currentBranch={currentBranch}
        tableNumber={tableNumber}
        user={user}
        loyaltyProfile={loyaltyProfile}
        onOpenLoyalty={() => setLoyaltyModalOpen(true)}
      />
      <LoyaltyModal />
    </>
  );
};

export default HeaderContainer;
