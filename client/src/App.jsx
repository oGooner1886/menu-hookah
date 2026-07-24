import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/Promo/Promo';
import { ScrollToTop } from './utils/scrollToTop';
import { useStore, BRANCHES } from './store/useStore';
import { Navigate } from 'react-router-dom';

function App() {
  const [modalActive, setModalActive] = useState(false);
  const location = useLocation();
  const setBranch = useStore((state) => state.setBranch);

  useEffect(() => {
    const pathBranch = location.pathname.split('/')[1];
    console.log(pathBranch);

    if (pathBranch === 'aroma') {
      setBranch(BRANCHES.AROMA);
    } else if (pathBranch === 'gusto') {
      setBranch(BRANCHES.GUSTO);
    }
  }, [location.pathBranch, setBranch]);

  return (
    <div className="App">
      <HeaderContainer />
      <Modal active={modalActive} setActive={setModalActive} />
      <ScrollToTop />
      <Routes>
        <Route path="/:branch/menu/*" element={<Menu />} />
        <Route path="/:branch/order" element={<OrderContainer />} />
        <Route path="/order" element={<Navigate to={'/'} replace />} />
        <Route path="/" element={<Promo />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
