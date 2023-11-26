import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Poke = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let poke = products.filter((item) => item.uid >= 300 && item.uid < 399);
  return (
    <div className={style.wrapper}>
      {poke.map((item) => (
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

export default Poke;
