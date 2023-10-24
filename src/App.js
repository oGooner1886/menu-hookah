import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import MainContent from "./components/MainContent/MainContent";
import Modal from "./components/Modal/Modal";
import Promo from "./components/promo/Promo";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Order from "./components/Order/Order";

function App() {
  const [modalActive, setModalActive] = useState(false);
  const [orders, setOrders] = useState([]);

  const addToOrder = (item) => {
    setOrders((orders) => [...orders, item]);
  };
  useEffect(() => {}, [orders]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path={"/home"} element={<Home />}></Route>
        <Route
          path={"/menu"}
          element={<MainContent onAdd={addToOrder} />}
        ></Route>
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
  );
}

export default App;
