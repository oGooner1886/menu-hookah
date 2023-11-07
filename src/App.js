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
function App() {
  const [modalActive, setModalActive] = useState(false);
  const [quantity, setQuantity] = useState(products);
  const [order, setOrder] = useState({})

  const addToOrder = (uid) => {
    setOrder(prevOrder => {
      const nextOrder = {...prevOrder}

      if (nextOrder[uid]) {
        nextOrder[uid]++
      } else {
        nextOrder[uid] = 1
      }

      return nextOrder
    })
  };

  const removeFromOrder = (uid) => {
    setOrder(prevOrder => {
      const nextOrder = {...prevOrder}

      if (nextOrder[uid]) {
        nextOrder[uid]--

        if (nextOrder[uid] === 0) {
          delete nextOrder[uid]
        }
      }

      return nextOrder
    })
  }

  const amount = products.reduce((total, product) => {
    if (order[product.uid]) {
      return total + (product.price * order[product.uid])
    }

    return total
  }, 0);


  const valueContext = {
    products,
    order,
    amount,
    addToOrder,
    removeFromOrder,
  };

  useEffect(() => {
    console.log(order);
  }, [order]);
  useEffect(() => {}, [quantity]);

  return (
    <Context.Provider value={valueContext}>
      <div className="App">
        <HeaderContainer />
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
