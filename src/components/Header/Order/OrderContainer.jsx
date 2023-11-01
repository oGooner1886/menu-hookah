import React, { useContext, useEffect, useState } from "react";
import styles from "./Order.module.css";
import Context from "../../../Context/Context";
import Order from "./Order"
import OrderTitle from "./OrderTitle/OrderTitle";
import EmptyOrder from "./EmptyOrder/EmptyOrder";
import AmountOrder from "./AmountOrder/AmountOrder";

const OrderContainer = () => {
  const value = useContext(Context)
  const {amount,orders, addToOrder} = value
  
  
  useEffect(()=>{console.log(orders);
  }, [orders])
  return (
    <div>
      {orders.length === 0 ? <EmptyOrder/> : <OrderTitle/> }
      
      {orders.map((el) => (
              <Order key={el.uid} item={el} add={addToOrder}/>
            ))}
      {orders.length > 0  && <AmountOrder amount={amount} /> }
    </div>
  );
};

export default OrderContainer;
// valueCounter={valueCounter}