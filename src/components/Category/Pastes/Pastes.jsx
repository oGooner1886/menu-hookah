import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Pastes = () => {
  const { products, order, addToOrder, removeFromOrder } = useContext(Context);
  let pastes = products.filter((item) => item.uid >= 100 && item.uid < 199);
  return (
    <div className={style.wrapper}>
      {pastes.map((item) => (
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

export default Pastes;
