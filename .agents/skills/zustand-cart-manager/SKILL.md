---
name: zustand-cart-manager
description: Правила и паттерны проектирования Zustand-стора для корзины заказов, размеров порций и модификаторов с поддержкой iiko Cloud API.
---

### Назначение и контекст
Скилл проектирования корзины заведения на Zustand.
Обеспечивает поддержку составных заказов (блюдо + размер + соусы/сиропы), изоляцию филиалов, атомарный расчет сумм и прямую совместимость с протоколом создания заказов iiko.

---

### 1. Архитектура элемента корзины (`CartItem`)

Каждая позиция в корзине имеет составной уникальный ключ (`cartItemId`):

```typescript
export interface SelectedModifier {
  id: string;        // UUID модификатора
  groupId: string;   // UUID группы
  name: string;      // "Сырный соус"
  price: number;     // 50 ₽
}

export interface CartItem {
  cartItemId: string; // Уникальный ключ: `${productId}:${sizeId}:${sortedModifierIds}`
  productId: string;  // UUID блюда в iiko
  sizeId?: string;    // UUID размера (если есть шкала)
  title: string;      // Название блюда
  sizeName?: string;  // "0.5 л" / "Большой"
  basePrice: number;  // Цена базовой порции
  modifiers: SelectedModifier[];
  amount: number;     // Количество порций
  itemPrice: number;  // Цена за 1 шт с учетом модификаторов
  comment?: string;   // Пожелания гостя
}
```

#### Генерация ключа:
```javascript
export const generateCartItemId = (productId, sizeId = 'default', modifiers = []) => {
  const modIds = (modifiers || [])
    .map((m) => m.id)
    .sort()
    .join(',');
  return `${productId}:${sizeId || 'default'}:${modIds}`;
};
```

---

### 2. Расчет стоимости и селекторы (Derived State)

1. **Цена единицы товара:**
   $$\text{itemPrice} = \text{basePrice} + \sum \text{modifier.price}$$
2. **Стоимость позиции:**
   $$\text{totalLinePrice} = \text{itemPrice} \times \text{amount}$$
3. **Атомарные селекторы:**
   Не перерисовывать весь UI при изменении количества. Использовать раздельные селекторы:
   - `selectCartItems(state)` — массив позиций
   - `selectTotalAmount(state)` — общая сумма в рублях
   - `selectTotalCount(state)` — общее число единиц блюд
   - `selectItemCount(cartItemId)` — количество конкретной модификации

---

### 3. Синхронизация и защита данных

1. **Изоляция по заведениям (Multi-Branch):**
   ```javascript
   orders: {
     [BRANCHES.GUSTO]: [],
     [BRANCHES.AROMA]: [],
   }
   ```
   При переключении филиала корзины не перезаписываются и не сбрасываются.

2. **Защита от стоп-листов:**
   Перед оформлением заказа выполнять валидацию:
   ```javascript
   const isItemAvailable = (item, stopList) => {
     if (stopList.includes(item.productId)) return false;
     if (item.sizeId && stopList.includes(item.sizeId)) return false;
     if (item.modifiers && item.modifiers.some((m) => stopList.includes(m.id))) return false;
     return true;
   };
   ```

3. **Маппинг в заказ iiko (`POST /api/1/order/create`):**
   ```javascript
   export const mapCartToIikoOrder = (cartItems) => {
     return cartItems.map((item) => ({
       productId: item.sizeId || item.productId,
       amount: item.amount,
       modifiers: (item.modifiers || []).map((m) => ({
         productId: m.id,
         amount: 1,
         productGroupId: m.groupId,
       })),
       comment: item.comment || undefined,
     }));
   };
   ```
