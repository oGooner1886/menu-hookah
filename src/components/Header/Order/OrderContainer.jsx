import React from 'react';
import styles from './Order.module.scss';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import {
  useAppStore,
  selectCurrentProducts,
  selectOrder,
  selectOrderAmount,
} from '../../../store';

const MemoizedOrderItem = React.memo(OrderItem);

const OrderContainer = () => {
  const currentProducts = useAppStore(selectCurrentProducts);
  const order = useAppStore(selectOrder);
  const amount = useAppStore(selectOrderAmount);
  const addToOrder = useAppStore((s) => s.addToOrder);
  const removeFromOrder = useAppStore((s) => s.removeFromOrder);
  const deleteOrder = useAppStore((s) => s.deleteOrder);

  const orderEntries = Object.entries(order);
  const hasItems = orderEntries.length > 0;

  const orderItems = orderEntries.map(([uid, portion]) => {
    const uidNum = Number(uid);

    let item = currentProducts.find((p) => p.uid === uidNum);

    if (!item) {
      for (const prod of currentProducts) {
        if (prod.editions) {
          const edition = prod.editions.find((ed) => ed.uid === uidNum);
          if (edition) {
            item = { ...edition, parentTitle: prod.title };
            break;
          }
        }
      }
    }

    if (!item) return null;

    const totalPrice = portion * (item.price || 0);

    return (
      <MemoizedOrderItem
        key={uid}
        item={item}
        portion={portion}
        totalPrice={totalPrice}
        add={() => addToOrder(uidNum)}
        remove={() => removeFromOrder(uidNum)}
      />
    );
  });

  return (
    <div className={styles.container}>
      {hasItems ? <OrderTitle /> : <EmptyOrder />}

      {orderItems}

      {hasItems && <AmountOrder amount={amount} onClear={deleteOrder} />}
    </div>
  );
};

export default OrderContainer;
