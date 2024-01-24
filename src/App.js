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
import ModalMenu from "./components/Menu/ModalMenu/ModalMenu";

function App() {
  const [modalActive, setModalActive] = useState(true);
  const [order, setOrder] = useState({});
  const [item, setItem] = useState(null);

  useEffect(() => console.log(item));

  const addToOrder = (uid) => {
    console.log(uid);
    setOrder((prevOrder) => {
      const nextOrder = { ...prevOrder };
      if (nextOrder[uid]) {
        nextOrder[uid]++;
        
        
      } else {
        nextOrder[uid] = 1;
      }
      console.log(nextOrder);
      

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
    // test

    item,
    setItem,
  };

  useEffect(() => {}, [order]);

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
        <Routes>
          <Route path={"/home"} element={<Home />}></Route>
          <Route path={"/menu/*"} element={<Menu />}></Route>
          <Route path={"/order"} element={<OrderContainer />}></Route>
        </Routes>
        <Modal active={modalActive} setActive={setModalActive} />
        {/* <Promo/> */}
      </div>
    </Context.Provider>
  );
}

export default App;
