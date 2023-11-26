import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const HotDish = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let hotDish = products.filter((item) => item.uid >= 400 && item.uid < 499);
  return (
    <div className={style.wrapper}>
      {hotDish.map((item) => (
        <MenuItem
          key={item.uid}
          item={item}
          portion={order[item.uid] || 0}
          addToOrder={addToOrder}
          removeFromOrder={removeFromOrder}
        />
      ))}
    </div>
  );
};

export default HotDish;
