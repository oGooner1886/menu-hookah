import React, { useState } from 'react';
import styles from './Order.module.css';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import {
  selectCurrentAmount,
  selectCurrentOrder,
  selectCurrentProducts,
  selectCurrentTotalItems,
  useStore,
} from '../../../store/useStore';
import { useParams, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from 'react-icons/bs';

const API_URL = 'http://localhost:3000/api';

const OrderContainer = () => {
  const { branch } = useParams();
  const navigate = useNavigate();
  const branchName = branch === 'aroma' ? 'Aroma' : 'Gusto Lounge';

  const currentProducts = useStore(selectCurrentProducts);
  const order = useStore(selectCurrentOrder);
  const amount = useStore(selectCurrentAmount);
  const totalItems = useStore(selectCurrentTotalItems);
  const addToOrder = useStore((state) => state.addToOrder);
  const removeFromOrder = useStore((state) => state.removeFromOrder);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const tableNumber = useStore((state) => state.tableNumber);
  const tableSession = useStore((state) => state.tableSession);
  const setTableNumber = useStore((state) => state.setTableNumber);
  const checkTableSession = useStore((state) => state.checkTableSession);
  const sessionToken = useStore((state) => state.sessionToken);

  const [comment, setComment] = useState('');
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tableInputVal, setTableInputVal] = useState(tableNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const orderEntries = Object.entries(order);
  const hasItems = orderEntries.length > 0;

  // Маппим позиции для отображения
  const orderItems = orderEntries.map(([uid, portion]) => {
    let item = (currentProducts || []).find((p) => String(p.uid) === uid);

    if (!item) {
      for (const prod of currentProducts || []) {
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
      <OrderItem
        key={uid}
        item={item}
        portion={portion}
        totalPrice={totalPrice}
        add={() => addToOrder(item.uid)}
        remove={() => removeFromOrder(item.uid)}
      />
    );
  });

  // Сохранение отредактированного стола
  const handleSaveTable = (e) => {
    e.preventDefault();
    if (tableInputVal.trim()) {
      setTableNumber(tableInputVal.trim());
      setIsEditingTable(false);
    }
  };

  // Отправка заказа на кухню
  const handlePlaceOrder = async () => {
    // Проверка УРОВНЯ 2: не истекла ли 4-часовая сессия стола
    const activeTable = checkTableSession();
    if (!activeTable) {
      alert('Время сессии стола истекло (> 4ч). Пожалуйста, отсканируйте QR-код на столе заново.');
      setIsEditingTable(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        tableNumber: String(activeTable),
        tableSign: tableSession?.sign || undefined,
        items: orderEntries.map(([uid, amount]) => ({
          productId: uid,
          amount,
        })),
        comment: comment.trim() || undefined,
      };

      const headers = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['Authorization'] = `Bearer ${sessionToken}`;
      }

      const res = await fetch(`${API_URL}/order/dine-in`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setOrderSuccess({
          orderId: data.order?.orderId || data.order?.id || '—',
          tableNumber,
        });
        deleteOrder();
      } else {
        alert(`Не удалось отправить заказ: ${data.error || 'Ошибка сервера'}`);
      }
    } catch (err) {
      console.error('Ошибка отправки заказа:', err);
      alert('Ошибка соединения с сервером. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {hasItems ? (
        <OrderTitle
          branchName={branchName}
          branch={branch}
          onClear={deleteOrder}
          totalItems={totalItems}
        />
      ) : (
        <EmptyOrder branchName={branchName} branch={branch} />
      )}

      {hasItems && (
        <>
          {/* Интерактивная карточка стола */}
          <div
            className={`${styles.tableCard} ${
              tableNumber ? styles.tableCardSuccess : styles.tableCardWarning
            }`}
          >
            {isEditingTable ? (
              <form className={styles.tableForm} onSubmit={handleSaveTable}>
                <span className={styles.tableTitle}>№ стола:</span>
                <input
                  type="text"
                  className={styles.tableInput}
                  placeholder="Напр: 14"
                  value={tableInputVal}
                  onChange={(e) => setTableInputVal(e.target.value)}
                  autoFocus
                />
                <button type="submit" className={styles.tableSaveBtn}>
                  OK
                </button>
                <button
                  type="button"
                  className={styles.tableCancelBtn}
                  onClick={() => setIsEditingTable(false)}
                >
                  Отмена
                </button>
              </form>
            ) : (
              <>
                <div className={styles.tableInfoLeft}>
                  <div
                    className={`${styles.tableBadge} ${
                      !tableNumber ? styles.tableBadgeWarning : ''
                    }`}
                  >
                    {tableNumber ? `Стол №${tableNumber}` : 'Стол не выбран'}
                  </div>
                  <div className={styles.tableDetails}>
                    <span className={styles.tableTitle}>
                      {tableNumber ? 'Подача за этот стол' : 'Укажите номер столика'}
                    </span>
                    <span className={styles.tableSubtitle}>
                      {tableNumber
                        ? 'Официант принесёт заказ к этому столу'
                        : 'Введите номер или отсканируйте QR на столе'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className={styles.tableEditBtn}
                  onClick={() => {
                    setTableInputVal(tableNumber || '');
                    setIsEditingTable(true);
                  }}
                >
                  {tableNumber ? 'Сменить стол' : 'Указать стол'}
                </button>
              </>
            )}
          </div>

          {/* Список выбранных блюд */}
          <div className={styles.itemsList}>{orderItems}</div>

          {/* Итог заказа и кнопка отправки */}
          <AmountOrder
            amount={amount}
            totalItems={totalItems}
            tableNumber={tableNumber}
            comment={comment}
            setComment={setComment}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Модалка успешного заказа */}
      {orderSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successModal}>
            <div className={styles.successIconWrap}>
              <BsCheck2Circle />
            </div>

            <h2 className={styles.successTitle}>Заказ успешно отправлен!</h2>
            <div className={styles.successTableBadge}>
              Стол №{orderSuccess.tableNumber}
            </div>

            <p className={styles.successDesc}>
              Официант и кухня уже получили ваш чек. Блюда и напитки будут поданы к вашему столику.
            </p>

            <button
              type="button"
              className={styles.successBtn}
              onClick={() => {
                setOrderSuccess(null);
                navigate(`/${branch}/menu`);
              }}
            >
              Вернуться в меню
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderContainer;
