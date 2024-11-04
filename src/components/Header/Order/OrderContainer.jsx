import React, { useContext } from 'react';
import styles from './Order.module.css';
import Context from '../../../Context/Context';
import Order from './Order';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';

const OrderContainer = () => {
  const value = useContext(Context);
  const { products, products_aroma, amount, order, addToOrder, removeFromOrder, priceItem, switchMenuMode } = value;
  const orderSize = Object.keys(order).length;

  return (
    <div className={styles.container}>
      {orderSize === 0 ? <EmptyOrder /> : <OrderTitle />}

      {switchMenuMode === true
        ? products.map((product) => {
            if (product.editions) {
              return product.editions.map((el) => {
                if (order[el.uid]) {
                  const portion = order[el.uid] || 0;
                  const totalPrice = portion * el.price;

                  return (
                    <Order
                      key={el.uid}
                      item={el}
                      portion={portion}
                      totalPrice={totalPrice}
                      add={addToOrder}
                      remove={removeFromOrder}
                      priceItem={priceItem}
                    />
                  );
                }
              });
            }
            if (order[product.uid]) {
              const portion = order[product.uid] || 0;
              const totalPrice = portion * product.price;

              return (
                <Order
                  key={product.uid}
                  item={product}
                  portion={portion}
                  totalPrice={totalPrice}
                  add={addToOrder}
                  remove={removeFromOrder}
                  priceItem={priceItem}
                />
              );
            }

            return null;
          })
        : products_aroma.map((product) => {
            if (product.editions) {
              return product.editions.map((el) => {
                if (order[el.uid]) {
                  const portion = order[el.uid] || 0;
                  const totalPrice = portion * el.price;
                  return (
                    <Order
                      key={el.uid}
                      item={el}
                      portion={portion}
                      totalPrice={totalPrice}
                      add={addToOrder}
                      remove={removeFromOrder}
                      priceItem={priceItem}
                    />
                  );
                }
              });
            }
            if (order[product.uid]) {
              const portion = order[product.uid] || 0;
              const totalPrice = portion * product.price;

              return (
                <Order
                  key={product.uid}
                  item={product}
                  portion={portion}
                  totalPrice={totalPrice}
                  add={addToOrder}
                  remove={removeFromOrder}
                  priceItem={priceItem}
                />
              );
            }

            return null;
          })}

      {orderSize > 0 && <AmountOrder amount={amount} />}
    </div>
  );
};

export default OrderContainer;
// valueCounter={valueCounter}
