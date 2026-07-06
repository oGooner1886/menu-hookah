import React from 'react';
import styles from './Order.module.css';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import { useMenuStore, selectCurrentProducts } from '../../../store/useMenuStore';

const MemoizedOrderItem = React.memo(OrderItem);

const OrderContainer = () => {
  const currentProducts = useMenuStore(selectCurrentProducts);
  const order = useMenuStore((state) => state.order);
  const amount = useMenuStore((state) => state.amount);
  const addToOrder = useMenuStore((state) => state.addToOrder);
  const removeFromOrder = useMenuStore((state) => state.removeFromOrder);
  const deleteOrder = useMenuStore((state) => state.deleteOrder);

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
