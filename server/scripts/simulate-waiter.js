import 'dotenv/config';

const tableNum = process.argv[2] || '9';
const itemName = process.argv[3] || 'Кальян Classic (Tangiers)';
const itemPrice = Number(process.argv[4]) || 1800;

// Таблица соответствия номеров столов UUID из iiko
const tableMap = {
  '9': '368e1492-64ca-4bfd-bac2-b8e0055fa361',
  '14': 'c41d13db-6512-42fe-b5ba-1ecdd5be3868',
};

const tableId = tableMap[tableNum] || '368e1492-64ca-4bfd-bac2-b8e0055fa361';

const mockWebhook = {
  eventType: 'TableOrderUpdate',
  eventInfo: {
    id: `order-sim-${Date.now()}`,
    order: {
      id: `order-sim-${Date.now()}`,
      number: 142,
      tableIds: [tableId],
      status: 'Bill',
      sum: itemPrice,
      waiter: { name: 'Кальянщик Алексей' },
      items: [
        {
          id: `item-${Date.now()}`,
          product: { name: itemName },
          amount: 1,
          price: itemPrice,
          sum: itemPrice,
          modifiers: [{ product: { name: 'Чаша грейпфрут' } }],
        },
      ],
    },
  },
};

async function send() {
  const url = 'http://localhost:3000/api/iiko/webhook';
  console.log(`\nОтправляем симуляцию официанта в ${url}...`);
  console.log(`Стол №${tableNum}: + "${itemName}" (${itemPrice} ₽, Чаша грейпфрут)`);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockWebhook),
    });

    if (res.ok) {
      console.log('\nУспешно! Вебхук принят сервером.');
      console.log('Посмотрите во вкладку браузера на страницу /order — позиция появится автоматически (или нажмите 🔄).\n');
    } else {
      console.error('Сервер ответил ошибкой:', res.status, await res.text());
    }
  } catch (err) {
    console.error('\nОшибка: не удалось связаться с сервером на http://localhost:3000');
    console.error('Убедитесь, что сервер запущен командой: npm --prefix server run dev');
  }
}

send();
