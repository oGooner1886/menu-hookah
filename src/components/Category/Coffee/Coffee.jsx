import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Coffee = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let coffee = products.filter((item) => item.uid >= 1100 && item.uid < 1199);
  return (
    <div className={style.wrapper}>
      {coffee.map((item) => (
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

export default Coffee;
