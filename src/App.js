import { useState, useMemo } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Context from './Context/Context';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/promo/Promo';
import products from './productsJSON.json';
import products_aroma from './productsJSON_aroma.json';
import { ScrollToTop } from './components/Scroll/ScrollToTop';

function App() {
  const [modalActive, setModalActive] = useState(true);
  const [order, setOrder] = useState({});
  const [item, setItem] = useState(null);
  const [lastAddedItemId, setLastAddedItemId] = useState(null);
  const [amount, setAmount] = useState(0);
  const location = useLocation();

  const isAroma = location.pathname.startsWith('/aroma/menu');

  const currentProducts = useMemo(() => {
    return isAroma ? products_aroma : products;
  }, [isAroma, products, products_aroma]);

  const priceMap = useMemo(() => {
    const map = {};
    currentProducts.forEach((prod) => {
      if (prod.uid) map[prod.uid] = prod.price || 0;
      if (prod.editions) {
        prod.editions.forEach((ed) => (map[ed.uid] = ed.price || 0));
      }
    });
    return map;
  }, [currentProducts]);

  const addToOrder = (uid) => {
    const price = priceMap[uid] || 0;
    setOrder((prev) => ({ ...prev, [uid]: (prev[uid] || 0) + 1 }));
    setAmount((prev) => prev + price);
    setLastAddedItemId(uid);
  };

  const removeFromOrder = (uid) => {
    setOrder((prev) => {
      const count = prev[uid];
      if (!count || count <= 0) {
        return prev; // ← ничего не делаем, если нет товара
      }

      const price = priceMap[uid] || 0;

      if (count === 1) {
        const { [uid]: _, ...newOrder } = prev; // eslint-disable-line no-unused-vars
        setAmount((a) => Math.max(0, a - price));
        return newOrder;
      }

      setAmount((a) => Math.max(0, a - price));
      return { ...prev, [uid]: count - 1 };
    });

    setLastAddedItemId(null);
  };

  const deleteOrder = () => {
    setOrder({});
    setAmount(0);
  };

  const valueContext = {
    products,
    products_aroma,
    currentProducts,
    order,
    addToOrder,
    removeFromOrder,
    amount,
    item,
    setItem,
    deleteOrder,
    lastAddedItemId,
    isAromaMenu: isAroma,
  };

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
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
    </Context.Provider>
  );
}

export default App;
