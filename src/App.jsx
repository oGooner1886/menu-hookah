import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/promo/Promo';
import { ScrollToTop } from './components/Scroll/ScrollToTop';
import { useStore, BRANCHES } from './store/useStore';

function App() {
  const [modalActive, setModalActive] = useState(false);
  const location = useLocation();

  const isAroma = location.pathname.startsWith('/aroma/menu');
  const setBranch = useStore((state) => state.setBranch);

  useEffect(() => {
    if (isAroma) {
      setBranch(BRANCHES.AROMA);
    } else {
      setBranch(BRANCHES.GUSTO);
    }
  }, [isAroma, setBranch]);

  return (
    <div className="App">
      <HeaderContainer />
      <Modal active={modalActive} setActive={setModalActive} />
      <ScrollToTop />
      <Routes>
        <Route path="/gusto/menu/*" element={<Menu />} />
        <Route path="/aroma/menu/*" element={<Menu />} />
        <Route path="/order" element={<OrderContainer />} />
        <Route path="/" element={<Promo />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
