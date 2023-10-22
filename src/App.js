import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import CardTest from "./components/MainContent/CardTest/CardTest";
import MainContent from "./components/MainContent/MainContent";
import Modal from "./components/Modal/Modal";
import Promo from "./components/promo/Promo";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home/Home";
import Order from "./components/Order/Order";
// import Salads from "./components/MainContent/Salads/Salads";

function App() {
  const [modalActive, setModalActive] = useState(false);
  // const userSession = localStorage.getItem('notFirstSession')
  // useEffect(() => {
  //   window.localStorage.setItem('RULES_FOR_VISITED', JSON.stringify(modalActive))

  // }, [modalActive])

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path={"/home"} element={<Home />}></Route>
      </Routes>
      <Routes>
        <Route path={"/menu"} element={<MainContent />}></Route>
      </Routes>
      <Routes>
        <Route path={"/order"} element={<Order />}></Route>
      </Routes>
      {/* <MainContent/> */}
      <Modal active={modalActive} setActive={setModalActive} />

      {/* <Promo/> */}
    </div>
  );
}

// {modalActive && (
//   <Modal active={modalActive} setActive={setModalActive}/>
// )}
export default App;
