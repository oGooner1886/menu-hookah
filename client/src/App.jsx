import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/Promo/Promo';
import Booking from './components/Booking/Booking';
import { ScrollToTop } from './utils/scrollToTop';
import { useStore, BRANCHES } from './store/useStore';
import { Navigate } from 'react-router-dom';

function App() {
  const [modalActive, setModalActive] = useState(false);
  const location = useLocation();
  const setBranch = useStore((state) => state.setBranch);
  const setTableNumber = useStore((state) => state.setTableNumber);

  // Считываем номер стола из QR-кода (?table=... или ?t=...)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tableParam = searchParams.get('table') || searchParams.get('t');
    if (tableParam) {
      setTableNumber(tableParam);
    }
  }, [location.search, setTableNumber]);

  useEffect(() => {
    const pathBranch = location.pathname.split('/')[1];

    if (pathBranch === 'aroma') {
      setBranch(BRANCHES.AROMA);
    } else if (pathBranch === 'gusto') {
      setBranch(BRANCHES.GUSTO);
    }
  }, [location.pathname, setBranch]);

  return (
    <div className="App">
      <HeaderContainer />
      <Modal active={modalActive} setActive={setModalActive} />
      <ScrollToTop />
      <Routes>
        <Route path="/:branch/menu/*" element={<Menu />} />
        <Route path="/:branch/order" element={<OrderContainer />} />
        <Route path="/:branch/booking" element={<Booking />} />
        <Route path="/order" element={<Navigate to={'/'} replace />} />
        <Route path="/" element={<Promo />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
