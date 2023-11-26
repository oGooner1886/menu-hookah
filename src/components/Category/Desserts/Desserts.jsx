import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Desserts = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let desserts = products.filter((item) => item.uid >= 700 && item.uid < 799);
  return (
    <div className={style.wrapper}>
      {desserts.map((item) => (
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

export default Desserts;
