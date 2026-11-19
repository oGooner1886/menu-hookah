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
  const checkTableSession = useStore((state) => state.checkTableSession);

  // Считываем номер стола и подпись из QR-кода (?table=...&sign=...)
  useEffect(() => {
    // Проверяем актуальность сессии (не прошло ли 4 часа)
    checkTableSession();

    const searchParams = new URLSearchParams(location.search);
    const tableParam = searchParams.get('table') || searchParams.get('t');
    const signParam = searchParams.get('sign') || searchParams.get('s');

    if (tableParam) {
      setTableNumber(tableParam, signParam);

      // УРОВЕНЬ 1: Моментально очищаем URL от секретных параметров и номера стола
      // В истории браузера и закладках останется только чистый URL (напр. /gusto/menu)
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [location.search, setTableNumber, checkTableSession]);

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
