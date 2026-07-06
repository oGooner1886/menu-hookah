import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/promo/Promo';
import BranchSync from './components/BranchSync/BranchSync';
import MenuLoader from './components/MenuLoader/MenuLoader';
import { ScrollToTop } from './components/Scroll/ScrollToTop';

function App() {
  const [modalActive, setModalActive] = useState(true);

  return (
    <div className="App">
      <MenuLoader />
      <BranchSync />
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/gusto/menu/*" element={<Menu />} />
        <Route path="/aroma/menu/*" element={<Menu />} />
        <Route path="/order" element={<OrderContainer />} />
        <Route path="/" element={<Promo />} />
      </Routes>
      <Modal active={!modalActive} setActive={setModalActive} />
      <Footer />
    </div>
  );
}

export default App;
