// import React, { useContext } from 'react';
// import styles from './Order.module.css';
// import Context from '../../../Context/Context';
// import Order from './Order';
// import OrderTitle from './OrderTitle/OrderTitle';
// import EmptyOrder from './EmptyOrder/EmptyOrder';
// import AmountOrder from './AmountOrder/AmountOrder';

// const OrderContainer = () => {
//   const value = useContext(Context);
//   const { products, products_aroma, amount, order, addToOrder, removeFromOrder, priceItem, switchMenuMode } = value;
//   const orderSize = Object.keys(order).length;

//   return (
//     <div className={styles.container}>
//       {orderSize === 0 ? <EmptyOrder /> : <OrderTitle />}

//       {switchMenuMode === true
//         ? products.map((product) => {
//             if (product.editions) {
//               return product.editions.map((el) => {
//                 if (order[el.uid]) {
//                   const portion = order[el.uid] || 0;
//                   const totalPrice = portion * el.price;

//                   return (
//                     <Order
//                       key={el.uid}
//                       item={el}
//                       portion={portion}
//                       totalPrice={totalPrice}
//                       add={addToOrder}
//                       remove={removeFromOrder}
//                       priceItem={priceItem}
//                     />
//                   );
//                 }
//               });
//             }
//             if (order[product.uid]) {
//               const portion = order[product.uid] || 0;
//               const totalPrice = portion * product.price;

//               return (
//                 <Order
//                   key={product.uid}
//                   item={product}
//                   portion={portion}
//                   totalPrice={totalPrice}
//                   add={addToOrder}
//                   remove={removeFromOrder}
//                   priceItem={priceItem}
//                 />
//               );
//             }

//             return null;
//           })
//         : products_aroma.map((product) => {
//             if (product.editions) {
//               return product.editions.map((el) => {
//                 if (order[el.uid]) {
//                   const portion = order[el.uid] || 0;
//                   const totalPrice = portion * el.price;
//                   return (
//                     <Order
//                       key={el.uid}
//                       item={el}
//                       portion={portion}
//                       totalPrice={totalPrice}
//                       add={addToOrder}
//                       remove={removeFromOrder}
//                       priceItem={priceItem}
//                     />
//                   );
//                 }
//               });
//             }
//             if (order[product.uid]) {
//               const portion = order[product.uid] || 0;
//               const totalPrice = portion * product.price;

//               return (
//                 <Order
//                   key={product.uid}
//                   item={product}
//                   portion={portion}
//                   totalPrice={totalPrice}
//                   add={addToOrder}
//                   remove={removeFromOrder}
//                   priceItem={priceItem}
//                 />
//               );
//             }

//             return null;
//           })}

//       {orderSize > 0 && <AmountOrder amount={amount} />}
//     </div>
//   );
// };

// export default OrderContainer;
// // valueCounter={valueCounter}
// src/components/Header/Order/OrderContainer.js

import React, { useContext } from 'react';
import styles from './Order.module.css';
import Context from '../../../Context/Context';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';  // переименовал для ясности

const MemoizedOrderItem = React.memo(OrderItem);

const OrderContainer = () => {
  const {
    currentProducts,
    order,
    amount,
    addToOrder,
    removeFromOrder,
    deleteOrder,
  } = useContext(Context);

  const orderEntries = Object.entries(order); // [ [uid, count], ... ]
  const hasItems = orderEntries.length > 0;

  // Рендерим ТОЛЬКО товары, которые в корзине
  const orderItems = orderEntries.map(([uid, portion]) => {
    const uidNum = Number(uid);

    // Ищем в основных товарах
    let item = currentProducts.find(p => p.uid === uidNum);

    // Если не нашли — ищем в editions
    if (!item) {
      for (const prod of currentProducts) {
        if (prod.editions) {
          const edition = prod.editions.find(ed => ed.uid === uidNum);
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