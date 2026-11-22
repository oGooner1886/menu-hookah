import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TableBill.module.css';

const TIP_PRESETS = [0, 5, 10, 15];

const TableBill = ({ bill, tableNumber, tableSign, branch, apiUrl, onRefreshBill }) => {
  const [tipPercent, setTipPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('sbp'); // 'sbp' | 'card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const billSum = Number(bill?.sum) || 0;
  const tipAmount = Math.round((billSum * tipPercent) / 100);
  const totalToPay = billSum + tipAmount;

  const handlePay = async (methodOverride) => {
    const selectedMethod = methodOverride || paymentMethod;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`${apiUrl}/order/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableNumber,
          tableSign,
          paymentMethod: selectedMethod,
          tipAmount: selectedMethod === 'waiter' ? 0 : tipAmount,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setStatusMessage({ type: 'info', text: data.error || 'Не удалось обработать запрос.' });
        return;
      }

      if (data.status === 'waiter_called') {
        setStatusMessage({
          type: 'success',
          text: `Официант уведомлён и скоро подойдёт с терминалом к столу №${tableNumber}.`,
        });
      } else if (data.status === 'payment_created' && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else if (data.status === 'acquiring_not_configured') {
        setStatusMessage({
          type: 'info',
          text: `Чек на ${totalToPay} ₽ подготовлен к оплате (${selectedMethod === 'sbp' ? 'СБП' : 'Карта'}). Онлайн-эквайринг будет подключен перед запуском.`,
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

  return (
    <div className={styles.billWrapper}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Ваш счёт</h1>
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
        <div className={styles.itemsList}>
          {(bill.items || []).map((item) => (
            <div key={item.id} className={styles.billItem}>
              <div className={styles.itemName}>
                <span>{item.name}</span>
                {item.amount > 1 && <span className={styles.itemMeta}>× {item.amount}</span>}
              </div>
              <div className={styles.itemPrice}>{item.sum} ₽</div>
            </div>
          ))}
        </div>

        <div className={styles.divider} />

        {/* Чаевые */}
        <div className={styles.tipsSection}>
          <div className={styles.tipsLabel}>Чаевые персоналу</div>
          <div className={styles.tipsRow}>
            {TIP_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                className={`${styles.tipBtn} ${tipPercent === pct ? styles.tipBtnActive : ''}`}
                onClick={() => setTipPercent(pct)}
              >
                {pct === 0 ? 'Без чаевых' : `${pct}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Способ самостоятельной оплаты */}
        <div className={styles.methodsRow}>
          <button
            type="button"
            className={`${styles.methodBtn} ${paymentMethod === 'sbp' ? styles.methodBtnActive : ''}`}
            onClick={() => setPaymentMethod('sbp')}
          >
            СБП
          </button>
          <button
            type="button"
            className={`${styles.methodBtn} ${paymentMethod === 'card' ? styles.methodBtnActive : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            Картой онлайн
          </button>
        </div>

        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>К оплате</span>
          <span className={styles.totalAmount}>{totalToPay} ₽</span>
        </div>

        <button
          type="button"
          className={styles.payBtn}
          onClick={() => handlePay()}
          disabled={isProcessing}
        >
          {isProcessing ? 'Подготовка оплаты...' : `Оплатить счёт • ${totalToPay} ₽`}
        </button>

        {/* Официант — лишь дополнительная опция */}
        <button
          type="button"
          className={styles.waiterSecondaryBtn}
          onClick={() => handlePay('waiter')}
          disabled={isProcessing}
        >
          Оплатить через официанта
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
