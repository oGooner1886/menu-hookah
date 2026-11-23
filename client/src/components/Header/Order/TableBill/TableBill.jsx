import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TableBill.module.css';
import { BsArrowRepeat, BsCheck2Circle } from 'react-icons/bs';

const TableBill = ({ bill, tableNumber, tableSign, branch, apiUrl, onRefreshBill }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const billSum = Number(bill?.sum) || 0;
  const isClosed = bill?.status === 'Closed' || bill?.isClosed;

  const handleRefresh = async () => {
    if (!onRefreshBill) return;
    setIsRefreshing(true);
    try {
      await onRefreshBill();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handlePay = async (method = 'tapper') => {
    setIsProcessing(true);
    setStatusMessage(null);

    // Если оплата через Tapper и уже есть ссылка в счёте:
    if (method === 'tapper' && bill?.tapperUrl) {
      window.location.href = bill.tapperUrl;
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/order/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          tableSign,
          paymentMethod: method,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setStatusMessage({ type: 'info', text: data.error || 'Не удалось обработать запрос.' });
        return;
      }

      if (data.status === 'tapper_redirect' && data.tapperUrl) {
        window.location.href = data.tapperUrl;
      } else if (data.status === 'waiter_called') {
        setStatusMessage({
          type: 'success',
          text: `Официант уведомлён и скоро подойдёт с терминалом к столу №${tableNumber}.`,
        });
      } else if (onRefreshBill) {
        onRefreshBill();
      }
    } catch {
      setStatusMessage({ type: 'info', text: 'Ошибка соединения. Попробуйте ещё раз.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isClosed) {
    return (
      <div className={styles.billWrapper}>
        <div className={styles.closedCard}>
          <div className={styles.closedIcon}>
            <BsCheck2Circle />
          </div>
          <h2 className={styles.closedTitle}>Счёт успешно оплачен!</h2>
          <p className={styles.closedSubtitle}>
            Спасибо, что провели время в Gusto Lounge. Будем рады видеть вас снова!
          </p>
          <Link to={`/${branch}/menu`} className={styles.returnMenuBtn}>
            В меню заведения
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.billWrapper}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <div className={styles.headerTopLine}>
            <h1 className={styles.title}>Ваш счёт</h1>
            <button
              type="button"
              className={`${styles.refreshBtn} ${isRefreshing ? styles.refreshBtnSpin : ''}`}
              onClick={handleRefresh}
              title="Обновить позиции счёта"
              aria-label="Обновить счёт"
            >
              <BsArrowRepeat />
            </button>
          </div>
          <span className={styles.subtitle}>
            Стол №{tableNumber}
            {bill.orderNumber ? ` • Чек #${bill.orderNumber}` : ''}
          </span>
        </div>

        <Link to={`/${branch}/menu`} className={styles.addMoreBtn}>
          + Дозаказать
        </Link>
      </div>

      <div className={styles.card}>
        {/* Список подтверждённых позиций — строго Read-Only */}
        <div className={styles.itemsList}>
          {(bill.items || []).map((item) => (
            <div key={item.id} className={styles.billItem}>
              <div className={styles.itemLeft}>
                <div className={styles.itemName}>
                  <span>{item.name}</span>
                  {item.amount > 1 && <span className={styles.itemMeta}>× {item.amount}</span>}
                </div>
                {Array.isArray(item.modifiers) && item.modifiers.length > 0 && (
                  <div className={styles.itemModifiers}>{item.modifiers.join(', ')}</div>
                )}
              </div>
              <div className={styles.itemPrice}>{item.sum} ₽</div>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Итого к оплате</span>
          <span className={styles.totalAmount}>{billSum} ₽</span>
        </div>

        {/* Главная кнопка: Оплата через Tapper (СБП / Карты / Разделение счёта / Чаевые) */}
        <button
          type="button"
          className={styles.tapperPayBtn}
          onClick={() => handlePay('tapper')}
          disabled={isProcessing}
        >
          <span className={styles.tapperTitle}>Оплатить счёт • {billSum} ₽</span>
          <span className={styles.tapperSub}>СБП • Карты • Разделение счёта • Чаевые</span>
        </button>

        {/* Запасной вариант: позвать официанта для расчёта на кассе */}
        <button
          type="button"
          className={styles.waiterSecondaryBtn}
          onClick={() => handlePay('waiter')}
          disabled={isProcessing}
        >
          Позвать официанта для расчёта
        </button>

        {statusMessage && (
          <div
            className={`${styles.statusNotice} ${
              statusMessage.type === 'info' ? styles.statusNoticeInfo : ''
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableBill;
