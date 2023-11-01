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
  const [orders, setOrders] = useState([]);
  const [store, setStore] = useState(products);
  const [quantity, setQuantity] = useState(products);

  const addToOrder = (item) => {
    let isInCart = orders.find((el) => el.uid == item.uid);
    if (isInCart) {
      setOrders((prevOrders) => {
        return [
          ...prevOrders.map((el) => {
            if (el.uid === item.uid) {
              return {
                ...el,
                portion: ++el.portion,
                totalPrice: +(el.portion * el.price),
              };
            }
            return el;
          }),
        ];
      });
    } else {
      setOrders((orders) => [...orders, item]);
    }
  };

  // const addToOrder = (item) => {
  //   let isInCart = false;
  //   orders.forEach((el) => {
  //     if (el.uid === item.uid) {
  //       isInCart = true;
  //       el.portion = ++el.portion
  //       el.totalPrice = +(el.portion * el.price);
  //     }
  //   });
  //   if (!isInCart) {
  //     setOrders((orders) => [...orders, item]);
  //   }
  // };

  const removeToOrder = (item, uid) => {
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
    setOrders((orders) => {
      return orders.filter((item) => {
        return uid != item.uid;
      });
    });
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
          };
        }
        return item;
      });
    });
  };
  const arrAllPrice = orders.map((el) => el.totalPrice);
  let amount = arrAllPrice.reduce((sum, current) => sum + current, 0);
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
    amount,
  };

  useEffect(() => {
    console.log(orders);
  }, [orders]);
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
