import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
// import MainContent from "./components/MainContent/MainContent";
import Modal from "./components/Modal/Modal";
import Promo from "./components/promo/Promo";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Menu from "./components/Menu/Menu";

import products from "./productsJSON.json";
import Context from "./Context/Context";
import OrderContainer from "./components/Header/Order/OrderContainer";
function App() {
  const [modalActive, setModalActive] = useState(false);
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(products);
  const [quantity, setQuantity] = useState(products);

  const addToOrder = (item) => {
    let isInCart = false;
    orders.forEach((el) => {
      if (el.uid === item.uid) {
        isInCart = true;
        return ++el.portion, (el.totalPrice = +(el.portion * el.price));
      }
    });
    if (!isInCart) {
      setOrders((orders) => [...orders, item]);
    }
  };

  const removeToOrder = (item) => {
    let isInCart = true;
    orders.forEach((el) => {
      if (el.uid === item.uid) {
        isInCart = false;
        return --el.portion, (el.totalPrice = +(el.portion * el.price));
      }
    });
    if (!isInCart) {
      setOrders((orders) => [...orders]);
    }
  };

  const incrQuantity = (uid) => {
    setQuantity((quantity) => {
      return quantity.map((item) => {
        if (item.uid === uid) {
          return {
            ...item,
            portion: ++item.portion,
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
            portion: item.portion > 0 ? --item.portion : 0,
            // totalPrice: prod.portion * prod.price
          };
        }

        return item;
      });
    });
  };
  const valueContext = {
    store,
    orders,
    quantity,
    setQuantity,
    addToOrder,
    incrQuantity,
    decrQuantity,
    removeToOrder,
    products,
  };

  useEffect(() => {}, [orders]);
  useEffect(() => {}, [quantity]);

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <Header />
        <Routes>
          <Route path={"/home"} element={<Home />}></Route>
          <Route path={"/menu"} element={<Menu />}></Route>
          <Route path={"/order"} element={<OrderContainer />}></Route>
        </Routes>
        {/* <Routes>
          <Route
            path={"/order"}
            element={orders.map((el) => (
              <Order key={el.uid} item={el} />
            ))}
          ></Route>
        </Routes> */}

        <Modal active={modalActive} setActive={setModalActive} />

        {/* <Promo/> */}
      </div>
    </Context.Provider>
  );
}

export default App;
