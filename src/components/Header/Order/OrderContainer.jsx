import React, { useContext, useEffect, useState } from "react";
import styles from "./Order.module.css";
import Context from "../../../Context/Context";
import Order from "./Order"
import OrderTitle from "./OrderTitle";
import EmptyOrder from "./EmptyOrder/EmptyOrder";
import AmountOrder from "./EmptyOrder/AmountOrder/AmountOrder";

const OrderContainer = () => {
  const value = useContext(Context)
  const {orders} = value
  const arrAllPrice = orders.map((el)=>el.totalPrice)
  let amount = arrAllPrice.reduce((sum, current) => sum + current, 0);
  
  
  return (
    <div>
      {value.orders.length === 0 ? <EmptyOrder/> : <OrderTitle/> }
      
      {value.orders.map((el) => (
              <Order key={el.uid} item={el} />
            ))}
      {value.orders.length > 0  && <AmountOrder amount={amount} /> }
    </div>
  );
};

export default OrderContainer;
// valueCounter={valueCounter}