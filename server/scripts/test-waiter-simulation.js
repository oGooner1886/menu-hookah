import 'dotenv/config';
import { loadTablesCache, handleIikoWebhookEvent } from '../src/services/table.service.js';
import { getTableBill } from '../src/services/order.service.js';

const mockLogger = { info: () => {}, warn: console.warn, error: console.error };

async function run() {
  console.log('--- ТЕСТ: Синхронизация заказов гостя и позиций от официанта ---');
  await loadTablesCache(mockLogger);

  // Шаг 1: Гость заказал чай через QR-меню
  handleIikoWebhookEvent(
    {
      eventType: 'TableOrderUpdate',
      eventInfo: {
        id: 'mock-order-101',
        order: {
          id: 'mock-order-101',
          number: 101,
          tableIds: ['368e1492-64ca-4bfd-bac2-b8e0055fa361'], // Стол 9
          status: 'New',
          sum: 650,
          items: [
            { id: '1', product: { id: 'p1', name: 'Вишнёвый чай 1л' }, amount: 1, sum: 650, price: 650 },
          ],
        },
      },
    },
    mockLogger
  );

  const bill1 = await getTableBill('9', mockLogger);
  console.log('1. Гость заказал через телефон:');
  console.log('   Позиции:', bill1.bill.items.map((i) => i.name));
  console.log('   Сумма:', bill1.bill.sum, '₽');

  // Шаг 2: Кальянщик подошел к столу и пробил на кассе iikoFront кальян в этот же чек
  handleIikoWebhookEvent(
    {
      eventType: 'TableOrderUpdate',
      eventInfo: {
        id: 'mock-order-101',
        order: {
          id: 'mock-order-101',
          number: 101,
          tableIds: ['368e1492-64ca-4bfd-bac2-b8e0055fa361'],
          status: 'Bill',
          sum: 2450,
          waiter: { name: 'Алексей' },
          items: [
            { id: '1', product: { id: 'p1', name: 'Вишнёвый чай 1л' }, amount: 1, sum: 650, price: 650 },
            {
              id: '2',
              product: { id: 'p2', name: 'Кальян Classic (Tangiers)' },
              amount: 1,
              sum: 1800,
              price: 1800,
              modifiers: [{ product: { name: 'Чаша грейпфрут' } }],
            },
          ],
        },
      },
    },
    mockLogger
  );

  const bill2 = await getTableBill('9', mockLogger);
  console.log('\n2. Кальянщик пробил кальян на кассе:');
  console.log('   Позиции:', bill2.bill.items.map((i) => `${i.name}${i.modifiers.length ? ' (' + i.modifiers.join(', ') + ')' : ''}`));
  console.log('   Сумма счёта:', bill2.bill.sum, '₽');

  // Шаг 3: Гость дозаказал десерт через телефон
  handleIikoWebhookEvent(
    {
      eventType: 'TableOrderUpdate',
      eventInfo: {
        id: 'mock-order-101',
        order: {
          id: 'mock-order-101',
          number: 101,
          tableIds: ['368e1492-64ca-4bfd-bac2-b8e0055fa361'],
          status: 'Bill',
          sum: 2850,
          items: [
            { id: '1', product: { id: 'p1', name: 'Вишнёвый чай 1л' }, amount: 1, sum: 650, price: 650 },
            {
              id: '2',
              product: { id: 'p2', name: 'Кальян Classic (Tangiers)' },
              amount: 1,
              sum: 1800,
              price: 1800,
              modifiers: [{ product: { name: 'Чаша грейпфрут' } }],
            },
            { id: '3', product: { id: 'p3', name: 'Чизкейк Нью-Йорк' }, amount: 1, sum: 400, price: 400 },
          ],
        },
      },
    },
    mockLogger
  );

  const bill3 = await getTableBill('9', mockLogger);
  console.log('\n3. Гость дозаказал десерт:');
  console.log('   Позиции:', bill3.bill.items.map((i) => i.name));
  console.log('   Итого к оплате:', bill3.bill.sum, '₽');
  console.log('   Ссылка Tapper:', bill3.bill.tapperUrl);
  console.log('\nТест пройден успешно!');
}

run().catch(console.error);

