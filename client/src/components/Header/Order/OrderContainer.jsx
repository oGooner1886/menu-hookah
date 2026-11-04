import React from 'react';
import styles from './Order.module.css';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import { selectCurrentAmount, selectCurrentOrder, selectCurrentProducts, useStore } from '../../../store/useStore';
import { useParams } from 'react-router-dom';

const MemoizedOrderItem = React.memo(OrderItem);

const OrderContainer = () => {
  const { branch } = useParams();
  const branchName = branch === 'aroma' ? 'Aroma' : 'Gusto Lounge';
  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);
  const amount = useStore(selectCurrentAmount);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);
  const deleteOrder = useStore((state) => state.deleteOrder);

  const orderEntries = Object.entries(order);
  const hasItems = orderEntries.length > 0;

  const orderItems = orderEntries.map(([uid, portion]) => {
    // uid в объекте order всегда строка (ключи объекта — строки)
    // Сравниваем через String() чтобы работало и с UUID (iiko) и с числами (aroma)
    let item = currentProducts.find((p) => String(p.uid) === uid);

    if (!item) {
      for (const prod of currentProducts) {
        if (prod.editions) {
          const edition = prod.editions.find((ed) => String(ed.uid) === uid);
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
        add={() => addToOrder(item.uid)}
        remove={() => removeFromOrder(item.uid)}
      />
    );
  });

  return (
    <div className={styles.container}>
      {hasItems ? (
        <OrderTitle branchName={branchName} branch={branch} />
      ) : (
        <EmptyOrder branchName={branchName} branch={branch} />
      )}

      {orderItems}

      {hasItems && <AmountOrder amount={amount} onClear={deleteOrder} />}
    </div>
  );
};

export default OrderContainer;
