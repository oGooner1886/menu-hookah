import React, { useContext, useEffect, useState } from "react";
import style from "./Menu.module.css";
import Context from "../../Context/Context";
import MenuItem from "./MenuItem/MenuItem";
import Category from "./Category/Category";
import { Route, Routes } from "react-router-dom";
import Soup from "./Category/Soup/Soup";
import HotDish from "./Category/HotDish/HotDish";
import Poke from "./Category/Poke/Poke";
import Snacks from "./Category/Snacks/Snacks";
import Pastes from "./Category/Pastes/Pastes";
import Lemonades from "./Category/Lemonades/Lemonades";
import Tea from "./Category/Tea/Tea";
import Coffee from "./Category/Coffee/Coffee";
import Desserts from "./Category/Desserts/Desserts";
import Milkshake from "./Category/Milkshake/Milkshake";
import Smoothie from "./Category/Smoothie/Smoothie";
import Salads from "./Category/Salads/Salads";
import ModalMenu from "./ModalMenu/ModalMenu";
import { flushSync } from "react-dom";
import NonAlco from "./Category/NonAlco/NonAlco";
import Alco from "./Category/Alco/Alco";

const Menu = () => {
  const [modalMenuActive, setModalMenuActive] = useState(false);
  const [editions, setEditions] = useState([]);
  // const [item, setItem] = useState({})
  const {
    products,
    order,
    addToOrder,
    removeFromOrder,
    item,
    setItem,
    setPriceItem,
    priceItem,
  } = useContext(Context);
  // const openModalForEdit = (item) => {
  // flushSync(() => {
  //   setModalMenuActive(() => {
  //     (item.editions || item.sauce) && setModalMenuActive(true);
  //   });
  // setItem(() => {
  //   return item;
  // });
  // setItem(item)
  // })
  // }

  //   // setEditions(() => {
  //   //   if (item.editions == undefined) {
  //   //    console.log("У этого товара нет дополнения");
  //   //   } else return item.editions;
  //   // });

  //   // return item.editions
  // };
  const closeModalForEdit = () => {
    setItem(null);
    // setModalMenuActive(() => {
    //   setModalMenuActive(false);
    // });
  };

  return (
    <div className={style.wrapper}>
      <div>
        <Category />
        <Routes>
          <Route
            path={"/salads"}
            element={<Salads openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/soup"}
            element={<Soup openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/HotDish"}
            element={<HotDish openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/poke"}
            element={<Poke openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/snacks"}
            element={<Snacks openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/pastes"}
            element={<Pastes openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/lemonades"}
            element={<Lemonades openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/tea"}
            element={<Tea openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/coffee"}
            element={<Coffee openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/desserts"}
            element={<Desserts openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/milkshake"}
            element={<Milkshake openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/smoothie"}
            element={<Smoothie openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/nonalco"}
            element={<NonAlco openModalForEdit={setItem} />}
          ></Route>
          <Route
            path={"/alco"}
            element={<Alco openModalForEdit={setItem} />}
          ></Route>
        </Routes>
        <div className={style.item__wrapper}>
          <Routes>
            <Route
              path={"/"}
              element={products.map((item) => (
                <MenuItem
                  key={item.uid}
                  item={item}
                  portion={order[item.uid] || 0}
                  addToOrder={addToOrder}
                  removeFromOrder={removeFromOrder}
                  openModalForEdit={setItem}
                />
              ))}
            ></Route>
          </Routes>
          {/* {products.map((item) => (
              <ModalMenu active={modalMenuActive} setActive={setModalMenuActive} item={item} key={item.uid}/> 
            ))} */}
          {item && (
            <ModalMenu
              // active={modalMenuActive}
              addToOrder={addToOrder}
              // setActive={setModalMenuActive}
              // editions={editions}
              item={item}
              closeModalForEdit={closeModalForEdit}
              // setPriceItem={setPriceItem}
              // priceItem={priceItem}
            />
          )}
          {/* <ModalMenu
            active={modalMenuActive}
            addToOrder={addToOrder}
            setActive={setModalMenuActive}
            editions={editions}
            item={item}
            closeModalForEdit={closeModalForEdit}
            setPriceItem={setPriceItem}
            priceItem={priceItem}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Menu;
// "UID salads (1-99), UID pasta (100-199),
// UID lightSnacks (200-299), UID poke (300-399),
// UID hotDish (400-499), UID soup (500-599),
// UID snacks (600-699), UID desserts (700-799),
// UID iceCream (800-899), UID milkshake (900-999),
// UID smoothie (1000-1099), UID coffee (1100-1199),
// UID tea (1200-1299), UID lemonade (1300-1399),
// UID drink (1400-1499), UID alcohol (1500-1599),
// UID options (1600-1699)",
