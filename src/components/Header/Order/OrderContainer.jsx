import React, { useContext, useState } from "react";
import styles from "./Order.module.css";
import Context from "../../../Context/Context";
import Order from "./Order"
import OrderTitle from "./OrderTitle";
import EmptyOrder from "./EmptyOrder/EmptyOrder";

const OrderContainer = () => {
  const value = useContext(Context)
    
  
  return (
    <div>
      {value.orders.length == 0 ? <EmptyOrder/> : <OrderTitle/>}
      
      {value.orders.map((el) => (
              <Order key={el.uid} item={el} />
            ))}
    </div>
  );
};

export default OrderContainer;
