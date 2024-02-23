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

function App() {
  const [modalActive, setModalActive] = useState(true);
  const [order, setOrder] = useState({});
  const [item, setItem] = useState(null);
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
  };

  const removeFromOrder = (uid) => {
    setOrder((prevOrder) => {
      const nextOrder = { ...prevOrder };
      if (nextOrder[uid]) {
        nextOrder[uid]--;
        if (nextOrder[uid] === 0) {
          delete nextOrder[uid];
        }
      }
      return nextOrder;
    });
  };

  const amount = products.reduce((sum, prod) => {
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
    products,
    order,
    addToOrder,
    removeFromOrder,
    amount,
    item,
    setItem,
  };

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
        <Routes>
          <Route path={'/home'} element={<Home />}></Route>
          <Route path={'/menu/*'} element={<Menu />}></Route>
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
