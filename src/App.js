import { useEffect, useState } from "react";
import "./App.css";
import Modal from "./components/Modal/Modal";
import Promo from "./components/promo/Promo";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";
import products from "./productsJSON.json";
import Context from "./Context/Context";
import OrderContainer from "./components/Header/Order/OrderContainer";
import HeaderContainer from "./components/Header/HeaderContainer";
import Category from "./components/Category/Category";
import Salads from "./components/Category/Salads/Salads";
import Soup from "./components/Category/Soup/Soup";
import HotDish from "./components/Category/HotDish/HotDish";
import Poke from "./components/Category/Poke/Poke";
import Snacks from "./components/Category/Snacks/Snacks";
import Pastes from "./components/Category/Pastes/Pastes";
import Lemonades from "./components/Category/Lemonades/Lemonades";
import Tea from "./components/Category/Tea/Tea";
import Coffee from "./components/Category/Coffee/Coffee";
import Desserts from "./components/Category/Desserts/Desserts";
import Milkshake from './components/Category/Milkshake/Milkshake';
import Smoothie from "./components/Category/Smoothie/Smoothie";

function App() {
  const [modalActive, setModalActive] = useState(false);
  const [order, setOrder] = useState({});

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

  let amount = products.reduce((sum, prod) => {
    if (order[prod.uid]) {
      return sum + prod.price * order[prod.uid];
    }
    return sum;
  }, 0);

  const valueContext = {
    products,
    order,
    addToOrder,
    removeFromOrder,
    amount,
  };

  useEffect(() => {}, [order]);

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
        <Category />
        <Routes>
          <Route path={"/home"} element={<Home />}></Route>
          <Route path={"/menu"} element={<Menu />}></Route>
          <Route path={"/menu/salads"} element={<Salads />}></Route>
          <Route path={"/menu/soup"} element={<Soup />}></Route>
          <Route path={"/menu/HotDish"} element={<HotDish />}></Route>
          <Route path={"/menu/poke"} element={<Poke />}></Route>
          <Route path={"/menu/snacks"} element={<Snacks />}></Route>
          <Route path={"/menu/pastes"} element={<Pastes />}></Route>
          <Route path={"/menu/lemonades"} element={<Lemonades />}></Route>
          <Route path={"/menu/tea"} element={<Tea />}></Route>
          <Route path={"/menu/coffee"} element={<Coffee />}></Route>
          <Route path={"/menu/desserts"} element={<Desserts />}></Route>
          <Route path={"/menu/milkshake"} element={<Milkshake />}></Route>
          <Route path={"/menu/smoothie"} element={<Smoothie />}></Route>
          <Route path={"/order"} element={<OrderContainer />}></Route>
        </Routes>
        <Modal active={modalActive} setActive={setModalActive} />

        {/* <Promo/> */}
      </div>
    </Context.Provider>
  );
}

export default App;
