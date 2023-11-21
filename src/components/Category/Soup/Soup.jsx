import React, { useContext } from "react";
import Context from "../../../Context/Context";
import MenuItem from "../../Menu/MenuItem/MenuItem";
import style from "../../Menu/Menu.module.css";

const Soup = () => {
    const { products, order, addToOrder, removeFromOrder } = useContext(Context);
    let soup = products.filter((item) => item.uid >= 500 && item.uid < 600);
    return (
      <div className={style.wrapper}>
        {soup.map((item) => (
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
}

export default Soup
