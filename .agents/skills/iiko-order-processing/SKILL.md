---
name: iiko-order-processing
description: Правила валидации, маппинга, сверки цен и отправки заказов/дозаказов в iiko Cloud API через Fastify BFF.
---

### Назначение и контекст
Скилл отвечает за жизненный цикл заказа на стороне Fastify BFF: валидация данных от клиента, сверка цен с локальным кэшем меню, выбор между созданием нового чека (`/order/create`) и дозаказом в открытый стол (`/order/add_items`).

---

### 1. Архитектура обработки заказа

1. **Валидация и безопасность (BFF Security):**
   - **Защита от подмены цен:** клиент передает `{ productId, sizeId, modifierIds, amount }`. Бэкенд рассчитывает итоговую цену самостоятельно, сверяясь с локальным кэшем `iiko-menu-sync`, и не доверяет клиенту.
   - **Проверка стоп-листа:** перед отправкой проверить, что ни одно блюдо или модификатор не попали в стоп-лист прямо перед оформлением.
   - **Обязательные поля:** `tableNumber` (или `tableId`), `organizationId`, валидный телефон гостя (или пометка о заказе за столом).

2. **Ветвление: Новый чек vs Дозаказ в открытый стол:**
   - Запрашиваем активный заказ стола: `POST /api/1/order/by_table`.
   - **Если заказ уже открыт:** отправляем `POST /api/1/order/add_items` с существующим `orderId`.
   - **Если стол пуст:** отправляем `POST /api/1/order/create` с типом обслуживания стола (`tableIds: [tableId]`).

3. **Маппинг структуры позиций iiko:**
   ```typescript
   export interface IikoOrderItem {
     productId: string;        // UUID блюда или размера
     type: 'Product';
     amount: number;
     comment?: string;
     modifiers?: {
       productId: string;      // UUID соуса / сиропа
       amount: number;
       productGroupId?: string;// UUID группы модификатора
     }[];
   }
   ```

4. **Идемпотентность:**
   - Передача уникального ключа запроса / хэша заказа для предотвращения дублирования чеков при сетевых сбоях и повторных нажатиях.

---

### 2. Пример реализации обработчика в Fastify BFF

```javascript
export async function handleDineInOrder(fastify, orderData) {
  const { tableNumber, items, phone, comment } = orderData;
  const token = await fastify.iiko.getToken();
  const orgId = process.env.IIKO_ORGANIZATION_GUSTO_ID;
  const table = fastify.tables.getInfo(tableNumber);

  // 1. Валидация по кэшу меню и стоп-листу
  const stopList = await fastify.iiko.getStopList();
  for (const item of items) {
    if (stopList.includes(item.productId)) {
      throw new Error(`Позиция временно недоступна (стоп-лист)`);
    }
  }

  // 2. Формирование структуры позиций с модификаторами
  const orderItems = items.map((it) => ({
    productId: it.sizeId || it.productId,
    type: 'Product',
    amount: it.amount,
    comment: it.comment || undefined,
    modifiers: (it.modifiers || []).map((m) => ({
      productId: m.id,
      amount: m.amount || 1,
      productGroupId: m.groupId,
    })),
  }));

  // 3. Проверка активного заказа за столом
  const activeOrder = await fastify.iiko.getActiveOrder(table.tableId, orgId, token);

  if (activeOrder) {
    // Дозаказ в открытый стол
    return await fastify.iiko.addItemsToOrder(activeOrder.id, orderItems, orgId, token);
  } else {
    // Открытие нового чека
    return await fastify.iiko.createTableOrder(table, orderItems, phone, comment, orgId, token);
  }
}
```
