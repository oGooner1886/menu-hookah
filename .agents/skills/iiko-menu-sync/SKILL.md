---
name: iiko-menu-sync
description: Руководство по получению, кешированию и обработке номенклатуры (блюда, размеры, модификаторы) и стоп-листов из iiko Cloud API для Fastify BFF.
---

### Назначение и контекст
Скилл проектирования и реализации BFF-слоя (Backend For Frontend) на Fastify для интеграции с iiko Cloud API.
Обеспечивает:
1. Автоматическое получение актуального меню с размерами порций и модификаторами.
2. Декомпозицию групп модификаторов для мобильной шторки выбора.
3. Проверку стоп-листов на уровне блюд и отдельных модификаторов.
4. Высокую производительность за счет многоуровневого In-Memory кэширования.

---

### 1. Архитектура работы с iiko Cloud API

1. **Авторизация (Token Manager):**
   - Эндпоинт: `POST https://api-ru.iiko.services/api/v2/access_token` (или `v1`).
   - Кэширование: In-Memory TTL = **40 минут** (токен iiko валиден 60 мин).
   - При ответе `401 Unauthorized` сбрасывать токен из кэша и выполнять 1 повторный запрос (Retry).

2. **Получение меню (External Menu API):**
   - Шаг 1: `POST /api/2/menu` — получение списка внешних меню организации.
   - Шаг 2: `POST /api/menu/v3/by_id` — получение полного дерева категорий, блюд, шкалы размеров (`sizePrices`) и модификаторов (`itemModifiers`).
   - Кэширование: TTL = **15 минут** с ключом по `organizationId`.

3. **Синхронизация стоп-листов:**
   - Эндпоинт: `POST /api/1/stop_lists` с массивом `organizationIds`.
   - Кэширование: TTL = **60 секунд** (динамические остатки кассы).
   - Проверка баланса: позиция считается недоступной, если `balance <= 0`.
   - Проставлять `isAvailable: false` как для самого блюда, так и для отдельных размеров (`BffSize`) и модификаторов (`BffModifier`).

---

### 2. Спецификация контракта BFF (`GET /api/v1/menu`)

```typescript
export interface BffCategory {
  id: string;          // UUID категории iiko
  name: string;        // Название ("Закуски", "Кофе", "Чай")
  order: number;       // Индекс сортировки
}

export interface BffSize {
  id: string;          // UUID размера/разновидности
  name: string;        // "0.5 л", "1.0 л", "150 г", "Стандарт"
  price: number;
  weight?: string;     // "500 мл", "150 г"
  isDefault: boolean;
  isAvailable: boolean;// false, если размер в стоп-листе
}

export interface BffModifier {
  id: string;          // UUID модификатора (например, "Сырный соус")
  name: string;
  price: number;
  isAvailable: boolean;// false, если соус/сироп закончился
}

export interface BffModifierGroup {
  id: string;          // ID группы модификаторов
  name: string;        // "Выберите соус", "Добавки к кофе"
  minAmount: number;   // 1 = обязательно выбрать, 0 = опционально
  maxAmount: number;   // 1 = radio (один), >1 = checkbox (несколько)
  required: boolean;   // minAmount > 0
  items: BffModifier[];
}

export interface BffProduct {
  id: string;          // UUID блюда iiko
  categoryId: string;  // UUID родительской категории
  name: string;
  description: string;
  price: number;       // Базовая цена (или минимальная "от...")
  imageUrl: string | null;
  isAvailable: boolean;// false, если все размеры/блюдо в стоп-листе
  sizes: BffSize[];    // Список объемов/граммовок (если есть выбор)
  modifierGroups: BffModifierGroup[]; // Соусы, сиропы, добавки
}
```

---

### 3. Правила трансформации и оптимизации

1. **Единые карточки для размеров:**
   - Если товар в iiko имеет несколько `sizePrices`, объединять их в единый `BffProduct` с массивом `sizes`.
   - Базовая цена `price` рассчитывается как `min(sizes.map(s => s.price))`.

2. **Очистка от мусора:**
   - Исключать позиции с ценой `0 ₽` (если это не бесплатный модификатор).
   - Фильтровать архивные или скрытые категории.

3. **Связка со стоп-листами:**
   - Если блюдо штучное (1 размер) и его ID в стопе → `isAvailable = false`.
   - Если у блюда несколько размеров и один из них в стопе → у этого размера `isAvailable = false`. Если все размеры в стопе → у всего блюда `isAvailable = false`.

