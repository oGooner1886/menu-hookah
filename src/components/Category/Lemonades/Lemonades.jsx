import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Lemonades = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let lemonades = products.filter((item) => item.uid >= 1300 && item.uid < 1399);
  return (
    <div className={style.wrapper}>
      {lemonades.map((item) => (
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

export default Lemonades;
