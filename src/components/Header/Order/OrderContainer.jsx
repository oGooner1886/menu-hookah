import React, { useContext } from 'react';
import styles from './Order.module.css';
import Context from '../../../Context/Context';
import Order from './Order';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';

const OrderContainer = () => {
  const value = useContext(Context);
  const { placeProducts, amount, order, addToOrder, removeFromOrder, priceItem } = value;
  const orderPositionsIds = Object.keys(order);

  return (
    <div className={styles.container}>
      {orderPositionsIds.length === 0 ? <EmptyOrder /> : <OrderTitle />}
      {orderPositionsIds.map((position) => {
        const item = placeProducts.find((el) => {
          const editionsExist = Boolean(el.editions);
          return editionsExist
            ? el.editions.some((edition) => edition.uid === Number(position))
            : el.uid === Number(position);
        });
        const portion = order[position];
        const totalPrice = portion * item.price;

        return (
          <Order
            key={item.uid}
            item={item}
            portion={portion}
            totalPrice={totalPrice}
            add={addToOrder}
            remove={removeFromOrder}
            priceItem={priceItem}
          />
        );
      })}

      {orderPositionsIds > 0 && <AmountOrder amount={amount} />}
    </div>
  );
};

export default OrderContainer;
// valueCounter={valueCounter}
