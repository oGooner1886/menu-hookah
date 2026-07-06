import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/promo/Promo';
import products from './productsJSON.json';
import products_aroma from './productsJSON_aroma.json';
import { ScrollToTop } from './components/Scroll/ScrollToTop';
import { useAppStore, selectWelcomeModalOpen } from './store';

function App() {
  const location = useLocation();
  const welcomeModalOpen = useAppStore(selectWelcomeModalOpen);
  const setWelcomeModalOpen = useAppStore((s) => s.setWelcomeModalOpen);
  const initCatalog = useAppStore((s) => s.initCatalog);
  const setBranch = useAppStore((s) => s.setBranch);

  useEffect(() => {
    initCatalog(products, products_aroma);
  }, [initCatalog]);

  useEffect(() => {
    const branch = location.pathname.startsWith('/aroma/menu') ? 'aroma' : 'gusto';
    setBranch(branch);
  }, [location.pathname, setBranch]);

  return (
    <div className="App">
      <HeaderContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/gusto/menu/*" element={<Menu />} />
        <Route path="/aroma/menu/*" element={<Menu />} />
        <Route path="/order" element={<OrderContainer />} />
        <Route path="/" element={<Promo />} />
      </Routes>
      <Modal active={!welcomeModalOpen} setActive={setWelcomeModalOpen} />
      <Footer />
    </div>
  );
}

export default App;
