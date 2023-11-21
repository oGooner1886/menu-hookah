import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Salads = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let salads = products.filter((item) => item.uid < 100);
  return (
    <div className={style.wrapper}>
      {salads.map((item) => (
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

export default Salads;
