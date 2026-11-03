# 🔍 Анализ проекта menu-hookah (Gusto Lounge)

## 📐 Архитектура (текущее состояние)

```
Браузер (React + Zustand)
    │
    ├─── /gusto/menu  → fetch('/api/menu')  ─┐
    └─── /aroma/menu  → ⚠️ СТАТИЧНЫЙ JSON    │
                                              ▼
                              Fastify (middleware-сервер)
                                  │
                                  ├── /api/menu       → iikoCloud API
                                  ├── /api/menu/stop-list
                                  ├── /api/order/dine-in
                                  └── /api/auth/*
```

**Стек:** React + Zustand + React Router (клиент), Fastify (сервер), iikoCloud REST API

---

## 🔴 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. Реальный API-ключ закоммичен в `.env` в репозиторий

**Файл:** `server/.env`

```env
IIKO_API_KEY=9df6a74fd5ed40e091cf8d15caf70c63
IIKO_CLIENT_SECRET_GUSTO=cvmTmCjT105akGMhHSYZTYH3eztvlz4VzXqSKlME11Q=
```

**Проблема:** `.env` попадает в git. Если репозиторий публичный или когда-либо станет публичным — ключи скомпрометированы.

**Решение:**
1. Немедленно добавить `server/.env` в `.gitignore`
2. Проверить git-историю на предмет прошлых коммитов с ключами
3. Если ключи в истории — создать новые ключи в iiko и удалить историю через `git filter-branch` или BFG Repo Cleaner

---

### 2. Сессии хранятся в памяти — теряются при перезапуске

**Файл:** `server/src/services/auth.service.js`

```js
const sessionCache = new Map(); // ← пропадает при рестарте
```

**Проблема:** При любом перезапуске сервера все активные пользователи будут автоматически разлогинены. Нет TTL на сессии — они накапливаются бесконечно.

**Решение:** Добавить TTL-очистку для сессий (аналогично SMS) или использовать подписанные JWT-токены (не требуют хранилища).

---

### 3. Баг: `currentBranch` — необъявленная переменная в `useStore`

**Файл:** `client/src/store/useStore.js`, строки 86 и 101

```js
addToOrder: (uid) => {
  set((state) => {
    const currentBranchOrder = state.orders[currentBranch] || {};  // ❌ ReferenceError!
```

`currentBranch` — не `state.branch`. Это баг — в продакшене корзина будет сломана при добавлении/удалении товаров.

**Решение:**
```js
const currentBranchOrder = state.orders[state.branch] || {};
```

---

### 4. Баг: `removeFromOrder` всегда удаляет всё количество, а не уменьшает на 1

**Файл:** `client/src/store/useStore.js`, строки 99–115

```js
// Логика некорректная: при count > 1 должен уменьшать, но из-за бага currentBranch
// строка 111 тоже использует необъявленный currentBranch
[currentBranch]: count === 1 ? restItems : { ...currentBranchOrder, [uid]: count - 1 },
```

Тот же баг с `currentBranch` — нужно заменить на `state.branch` везде внутри `set()`.

---

### 5. Создание заказа: токен запрашивается, но не передаётся в `getActiveOrderForTable`

**Файл:** `server/src/services/order.service.js`, строка 53

```js
const token = await getIikoToken(logger);         // ← токен есть
const activeOrder = await getActiveOrderForTable(tableInfo.tableId, cleanOrgId); // ❌ token не передан!
```

Функция `getActiveOrderForTable` требует `token` третьим аргументом, но он не передаётся → `Authorization: Bearer undefined`.

---

## 🟡 СРЕДНИЕ ПРОБЛЕМЫ

### 6. Aroma-филиал не интегрирован с iiko — статичный JSON

**Файл:** `client/src/store/useStore.js`, строка 2

```js
import products_aroma from '../data/productsJSON_aroma.json';
```

Aroma работает только на основе статичного файла. Никакого stop-list, никаких актуальных цен. После добавления второго филиала в iiko — нужна вторая организация/отдельная логика.

---

### 7. `API_URL` захардкожен в store на `localhost`

**Файл:** `client/src/store/useStore.js`, строка 5

```js
const API_URL = 'http://localhost:3000/api'; // ← сломается в продакшене!
```

`.env`-файл клиента создан, но используется неправильно — это не `.env` Vite формата (переменные должны начинаться с `VITE_`).

**Решение:**
```js
// client/.env
VITE_API_URL=http://localhost:3000/api

// useStore.js
const API_URL = import.meta.env.VITE_API_URL;
```

---

### 8. Сервер не подтверждает iiko при создании заказа — нет проверки стоп-листа

**Файл:** `server/src/services/order.service.js`

При `createDineInOrder` стоп-лист не проверяется. Можно добавить блюдо из стоп-листа — iiko вернёт ошибку, но сообщение об ошибке пойдёт сырым текстом на клиент.

---

### 9. `iiko.service.js` - путаница в версиях API

```js
fetch('https://api-ru.iiko.services/api/v2/access_token')  // v2
fetch('https://api-ru.iiko.services/api/2/menu')           // 2 (без 'v')
fetch('https://api-ru.iiko.services/api/menu/v3/by_id')    // menu/v3
fetch('https://api-ru.iiko.services/api/1/stop_lists')     // 1
```

Разные версии и форматы URL — признак что код писался итеративно и копировался. Нет единой константы для базового URL.

---

### 10. `typo` в `server.js` — опечатка в конфигурации логгера

```js
tranlateTime: 'HH:MM:ss Z',  // ❌ опечатка: tranlate вместо translate
```

Время в логах не будет форматироваться.

---

### 11. `app.jsx` — зависимость эффекта неправильная

```js
useEffect(() => {
  // ...
}, [location.pathBranch, setBranch]); // ❌ pathBranch нет на объекте location
```

Правильно: `location.pathname`.

---

### 12. Нет защиты эндпоинтов от перебора на `/api/order`

Эндпоинт заказа защищён авторизацией, но нет rate-limiting — можно спамить заказами.

---

## 🟢 МЕЛКИЕ УЛУЧШЕНИЯ

### 13. Консоль-логи и транслит в продакшн-коде

```js
console.log(pathBranch); // App.jsx — дебаг-лог в продакшене
// server.js:
console.log(`Server zapushen na http://localhost:${port}`)
```

Все логи должны идти через `fastify.log`, а `console.log` в клиенте убрать.

---

### 14. Дубль файла `useStore copy.js`

В `client/src/store/` лежит `useStore copy.js` — артефакт разработки, который не нужен в репозитории.

---

### 15. Таблицы загружаются один раз при старте — нет механизма обновления

**Файл:** `server/src/services/table.service.js`

`loadTablesCache()` вызывается при старте сервера и никогда более. При добавлении нового стола в iiko — нужно перезапускать сервер.

---

### 16. Yandex OAuth — опечатка в URL

```js
fetch('https:/login.yandex.ru/info?format=json', // ❌ один слэш вместо двух
```

Yandex-авторизация полностью сломана из-за опечатки.

---

### 17. SMS-аутентификация — это MOCK

```js
export async function sendSms(phone, logger) {
  const code = ...;
  logger.info(`[SMS MOCK] OTPRAVLEN COD ${code} NA NOMER ${phone}`);
```

Реальная SMS-отправка не реализована. В продакшн так не пойдёт.

---

## 🗺️ ДОРОЖНАЯ КАРТА (рекомендации по приоритетам)

### Итерация 1 — Критические фиксы (сейчас)
- [ ] Убрать `.env` из git, добавить в `.gitignore`, ротировать ключи
- [ ] Исправить баг `currentBranch` → `state.branch` в `useStore`
- [ ] Исправить передачу `token` в `getActiveOrderForTable`
- [ ] Исправить `https:/login.yandex.ru` (два слэша)
- [ ] Исправить опечатку `translateTime` в логгере

### Итерация 2 — Стабильность (ближайший спринт)
- [ ] Перенести `API_URL` в `VITE_API_URL` через `.env`
- [ ] Добавить TTL и очистку для `sessionCache`
- [ ] Добавить проверку стоп-листа перед созданием заказа
- [ ] Добавить cron или endpoint для обновления кэша столов без перезапуска
- [ ] Удалить `useStore copy.js`

### Итерация 3 — Масштабирование (многофилиальность)
- [ ] Параметризировать `iiko.service.js` под несколько организаций
- [ ] Подключить Aroma к iikoCloud (свой `orgId`, `appId`, `clientSecret`)
- [ ] Вынести конфигурацию филиалов в отдельный конфиг-файл

### Итерация 4 — Аутентификация
- [ ] Интегрировать реального SMS-провайдера (например, [SMS.ru](https://sms.ru) или [SMSC](https://smsc.ru))
- [ ] Рассмотреть JWT вместо `sessionCache` в памяти
- [ ] Полноценный Yandex OAuth flow (redirect → callback)

### Итерация 5 — UX/UI
- [ ] Состояние загрузки при `isLoadingMenu: true` (скелетон/спиннер)
- [ ] Обработка ошибки загрузки меню на клиенте (сейчас просто `console.error`)
- [ ] Отображение стоп-листа на карточках товаров (серый фон / "Нет в наличии")
- [ ] Темизация по филиалу (другой цвет/логотип для Aroma vs Gusto)
