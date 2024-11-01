import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Context from './Context/Context';
import Footer from './components/Footer/Footer';
import HeaderContainer from './components/Header/HeaderContainer';
import OrderContainer from './components/Header/Order/OrderContainer';
import Home from './components/Home/Home';
import Menu from './components/Menu/Menu';
import Modal from './components/Modal/Modal';
import Promo from './components/promo/Promo';
import products from './productsJSON.json';
import products_aroma from './productsJSON_aroma.json';
import { ScrollToTop } from './components/Scroll/ScrollToTop';
import { editionsMaping } from './utils/consts';

function App() {
  const [modalActive, setModalActive] = useState(true);

  const [switchMenuMode, setSwitchMenuMode] = useState(JSON.parse(sessionStorage.getItem('menuMode')));

  const [order, setOrder] = useState({});
  const [item, setItem] = useState(null);

  const [lastAddedItemId, setLastAddedItemId] = useState(null);
  const [categoryUse, setCategoryUse] = useState(null);

  const addToOrder = (uid) => {
    setOrder((prevOrder) => {
      const nextOrder = { ...prevOrder };
      if (nextOrder[uid]) {
        nextOrder[uid]++;
      } else {
        nextOrder[uid] = 1;
      }
      return nextOrder;
    });
    setLastAddedItemId(uid);
  };

  const switchMenuOnAroma = () => {
    setSwitchMenuMode('Aroma');
    sessionStorage.setItem('menuMode', JSON.stringify('Aroma'));
  };
  const switchMenuOnGusto = () => {
    setSwitchMenuMode('Gusto');
    sessionStorage.setItem('menuMode', JSON.stringify('Gusto'));
  };

  const removeFromOrder = (uid) => {
    setOrder((prevOrder) => {
      const nextOrder = { ...prevOrder };

      if (nextOrder[uid]) {
        nextOrder[uid]--;
        if (nextOrder[uid] === 0) {
          delete nextOrder[uid];
        }
      } else {
        if (nextOrder[lastAddedItemId]) {
          nextOrder[lastAddedItemId]--;
        } else if (nextOrder[editionsMaping[lastAddedItemId]]) {
          nextOrder[editionsMaping[lastAddedItemId]]--;
        }
      }
      return nextOrder;
    });
  };

  const deleteOrder = () => {
    setOrder({});
  };
  const placeProducts = switchMenuMode === 'Gusto' ? products : products_aroma;

  const amount = placeProducts.reduce((sum, prod) => {
    let startEditions = 0;
    if (prod.editions) {
      startEditions = prod.editions.reduce((sum, edit) => {
        if (order[edit.uid]) {
          return sum + edit.price * order[edit.uid];
        }
        return sum;
      }, 0);
    }
    if (order[prod.uid]) {
      return sum + startEditions + prod.price * order[prod.uid];
    }

    return sum + startEditions;
  }, 0);

  const valueContext = {
    placeProducts,
    order,
    addToOrder,
    removeFromOrder,
    amount,
    item,
    setItem,
    switchMenuMode,
    setSwitchMenuMode,
    switchMenuOnAroma,
    switchMenuOnGusto,
    deleteOrder,
    categoryUse,
    setCategoryUse,
  };

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
        <ScrollToTop />
        <Routes>
          <Route path={'/home'} element={<Home />}></Route>
          <Route path={'/gusto/menu/*'} element={<Menu />}></Route>
          <Route path={'/aroma/menu/*'} element={<Menu />}></Route>
          <Route path={'/order'} element={<OrderContainer />}></Route>
          <Route path={''} element={<Promo />} />
        </Routes>
        <Modal active={modalActive} setActive={setModalActive} />
        <Footer />
      </div>
    </Context.Provider>
  );
}

export default App;
