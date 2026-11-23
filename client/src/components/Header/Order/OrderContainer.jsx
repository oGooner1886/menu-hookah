import React, { useState, useEffect, useCallback } from 'react';
import styles from './Order.module.css';
import OrderTitle from './OrderTitle/OrderTitle';
import EmptyOrder from './EmptyOrder/EmptyOrder';
import AmountOrder from './AmountOrder/AmountOrder';
import OrderItem from './Order';
import QrScannerModal from './QrScannerModal/QrScannerModal';
import TableBill from './TableBill/TableBill';
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
  const fetchMenu = useStore((state) => state.fetchMenu);
  const tableNumber = useStore((state) => state.tableNumber);
  const tableSession = useStore((state) => state.tableSession);
  const setTableNumber = useStore((state) => state.setTableNumber);
  const checkTableSession = useStore((state) => state.checkTableSession);
  const sessionToken = useStore((state) => state.sessionToken);

  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [activeBill, setActiveBill] = useState(null);

  const isTableVerified = Boolean(tableNumber && tableSession?.sign);

  // Подгружаем меню, если пользователь обновил страницу /order напрямую
  useEffect(() => {
    if (branch !== 'aroma' && (!currentProducts || currentProducts.length === 0)) {
      fetchMenu();
    }
  }, [branch, currentProducts, fetchMenu]);

  // Загружаем открытый счёт столика (если стол подтверждён)
  const fetchTableBill = useCallback(async () => {
    if (!tableNumber || !tableSession?.sign) {
      setActiveBill(null);
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/order/table-bill?table=${encodeURIComponent(tableNumber)}&sign=${encodeURIComponent(tableSession.sign)}`
      );
      const data = await res.json();
      if (data.success && data.hasActiveBill && data.bill) {
        setActiveBill(data.bill);
      } else {
        setActiveBill(null);
      }
    } catch {
      // Если iiko временно недоступен — остаёмся в обычном режиме корзины
    }
  }, [tableNumber, tableSession]);

  useEffect(() => {
    fetchTableBill();

    // Фоновое автообновление открытого счёта каждые 15 сек:
    // моментально подтягивает кальяны от официанта или статус закрытия чека
    if (!tableNumber || !tableSession?.sign) return;

    const intervalId = setInterval(() => {
      if (!document.hidden) {
        fetchTableBill();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchTableBill, tableNumber, tableSession]);

  const handleQrSuccess = useCallback(
    (table, sign) => {
      setTableNumber(table, sign);
      setIsScannerOpen(false);
    },
    [setTableNumber]
  );

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

  // Отправка заказа на кухню
  const handlePlaceOrder = async () => {
    // Проверка УРОВНЯ 2: не истекла ли 4-часовая сессия стола
    const activeTable = checkTableSession();
    if (!activeTable) {
      setIsScannerOpen(true);
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
        fetchTableBill();
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
      ) : isTableVerified && activeBill ? (
        <TableBill
          bill={activeBill}
          tableNumber={tableNumber}
          tableSign={tableSession.sign}
          branch={branch}
          apiUrl={API_URL}
          onRefreshBill={fetchTableBill}
        />
      ) : (
        <EmptyOrder branchName={branchName} branch={branch} />
      )}

      {hasItems && (
        <>
          {/* Минималистичный бейдж стола (показывается только когда стол подтверждён) */}
          {isTableVerified && (
            <div className={`${styles.tableCard} ${styles.tableCardSuccess}`}>
              <div className={styles.tableInfoLeft}>
                <div className={styles.tableBadge}>Стол №{tableNumber}</div>
                <div className={styles.tableDetails}>
                  <span className={styles.tableTitle}>
                    {activeBill ? `Открытый счёт: ${activeBill.sum} ₽` : 'Подача к вашему столику'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Список выбранных блюд */}
          <div className={styles.itemsList}>{orderItems}</div>

          {/* Итог заказа и кнопка отправки */}
          <AmountOrder
            amount={amount}
            totalItems={totalItems}
            tableNumber={isTableVerified ? tableNumber : null}
            hasActiveBill={Boolean(activeBill)}
            comment={comment}
            setComment={setComment}
            onPlaceOrder={handlePlaceOrder}
            onScanQr={() => setIsScannerOpen(true)}
            isSubmitting={isSubmitting}
          />
        </>
      )}

      {/* Встроенный QR-сканер (сохраняет корзину без перезагрузки) */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQrSuccess}
      />

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
