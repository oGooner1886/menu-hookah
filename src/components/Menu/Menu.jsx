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

const Menu = () => {
  const [modalMenuActive, setModalMenuActive] = useState(false);
  const [items, setItems] = useState([])
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  const openModalForEdit = (item) => {
    setModalMenuActive(() => {
      (item.editions || item.sauce) && setModalMenuActive(true);
    });
    setItems(()=>{
      if(item.editions == undefined){
        //     // return Object.values(editions)
        console.log('У этого товара нет дополнения');
        
      }else return item.editions
      
    })

  };
  
  return (
    <div className={style.wrapper}>
      <div>
        <Category />
        <Routes>
          <Route path={"/salads"} element={<Salads openModalForEdit={openModalForEdit} />}></Route>
          <Route path={"/soup"} element={<Soup />}></Route>
          <Route path={"/HotDish"} element={<HotDish />}></Route>
          <Route path={"/poke"} element={<Poke />}></Route>
          <Route path={"/snacks"} element={<Snacks />}></Route>
          <Route path={"/pastes"} element={<Pastes />}></Route>
          <Route path={"/lemonades"} element={<Lemonades />}></Route>
          <Route path={"/tea"} element={<Tea />}></Route>
          <Route path={"/coffee"} element={<Coffee />}></Route>
          <Route path={"/desserts"} element={<Desserts />}></Route>
          <Route path={"/milkshake"} element={<Milkshake />}></Route>
          <Route path={"/smoothie"} element={<Smoothie />}></Route>
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
                  openModalForEdit={openModalForEdit}
                  
                />
              ))}
            ></Route>
          </Routes>
            {/* {products.map((item) => (
              <ModalMenu active={modalMenuActive} setActive={setModalMenuActive} item={item} key={item.uid}/> 
            ))} */}
          <ModalMenu active={modalMenuActive} setActive={setModalMenuActive} items={items}/>
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
