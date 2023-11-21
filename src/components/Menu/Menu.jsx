import React, { useContext } from "react";
import style from "./Menu.module.css";
import Context from "../../Context/Context";
import MenuItem from "./MenuItem/MenuItem";
const Menu = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  // let salads = products.filter(item => item.uid < 100)
  // const editions = products.map((item)=>{
    
  //     return item.sauce
    
  // })
  // console.log(editions);
  
  
  
  
  return (
    <div className={style.wrapper}>
      
      {/* {salads.map((item) => (
        <MenuItem 
        key={item.uid}
        item={item}
        portion={order[item.uid] || 0}
        addToOrder={addToOrder}
        removeFromOrder={removeFromOrder}/>
      ))} */}
      {products.map((item) => (
        <MenuItem
          key={item.uid}
          item={item}
          portion={order[item.uid] || 0}
          addToOrder={addToOrder}
          removeFromOrder={removeFromOrder}
        />
      )
      
      )}
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
