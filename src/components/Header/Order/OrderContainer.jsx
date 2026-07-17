import React from 'react';
import styles from './Order.module.css';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import { selectCurrentAmount, selectCurrentOrder, selectCurrentProducts, useStore } from '../../../store/useStore';

const MemoizedOrderItem = React.memo(OrderItem);

const OrderContainer = () => {
  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);
  const amount = useStore(selectCurrentAmount);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);
  const deleteOrder = useStore((state) => state.deleteOrder);

  const orderEntries = Object.entries(order);
  const hasItems = orderEntries.length > 0;

  // Рендерим ТОЛЬКО товары, которые в корзине
  const orderItems = orderEntries.map(([uid, portion]) => {
    const uidNum = Number(uid);

    // Ищем в основных товарах
    let item = currentProducts.find((p) => p.uid === uidNum);

    // Если не нашли — ищем в editions
    if (!item) {
      for (const prod of currentProducts) {
        if (prod.editions) {
          const edition = prod.editions.find((ed) => ed.uid === uidNum);
          if (edition) {
            item = { ...edition, parentTitle: prod.title }; // добавляем название родителя
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
        // parentTitle={item.parentTitle} // если хочешь показывать "Картофель фри (Большая порция)"
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
