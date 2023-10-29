import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
// import MainContent from "./components/MainContent/MainContent";
import Modal from "./components/Modal/Modal";
import Promo from "./components/promo/Promo";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Order from "./components/Header/Order/Order";
import Menu from "./components/Menu/Menu";

import products from "./productsJSON.json";
import Context from "./Context/Context";
function App() {
  const [modalActive, setModalActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(products);
  const [quantity, setQuantity] = useState(products);

  const addToOrder = (item) => {
    setOrders((orders) => [...orders, item]);
  };
  const removeToOrder = () => {
    setOrders((orders) => []);
  };


  const incrQuantity = (uid) => {
    setQuantity((quantity) => {
      return quantity.map((item) => {
        if (item.uid === uid) {
          return {
            ...item,
            portion: ++item.portion,
            // totalPrice: prod.portion * prod.price
          };
        }

        return item;
      });
    });
  };
  const decrQuantity = (uid) => {
    setQuantity((quantity) => {
      return quantity.map((item) => {
        if (item.uid === uid) {
          return {
            ...item,
            portion: item.portion > 1 ? --item.portion : 0,
            // totalPrice: prod.portion * prod.price
          };
        }

        return item;
      });
    });
  };
  const valueContext = {
    store,
    quantity,
    setQuantity,
    addToOrder,
    incrQuantity,
    decrQuantity,
    removeToOrder
  };

  useEffect(() => {}, [orders]);
  useEffect(() => {}, [quantity]);

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <Header />
        <Routes>
          <Route path={"/home"} element={<Home />}></Route>
          {/* <Route
          path={"/menu"}
          element={<MainContent onAdd={addToOrder} />}
        ></Route> */}
          <Route path={"/menu"} element={<Menu />}></Route>
        </Routes>
        <Routes>
          <Route
            path={"/order"}
            element={orders.map((el) => (
              <Order key={el.uid} item={el} />
            ))}
          ></Route>
        </Routes>

        <Modal active={modalActive} setActive={setModalActive} />

        {/* <Promo/> */}
      </div>
    </Context.Provider>
  );
}

export default App;
