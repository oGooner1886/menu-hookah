# Gusto Lounge — Menu Hookah

Меню для кальянных **Gusto Lounge** и **Aroma** на React с CMS на Strapi.

## Архитектура

```
iiko Cloud API  ──(cron)──►  Strapi CMS  ──REST──►  React SPA (Zustand)
```

- **Frontend** — React 18, React Router, Zustand, CSS Modules
- **CMS** — Strapi 5 (`/strapi`), Docker-ready
- **Fallback** — если Strapi недоступен, меню загружается из локальных JSON

## Быстрый старт

### Frontend

```bash
cp .env.example .env
npm install
npm start
```

Приложение: http://localhost:3000

### Strapi (локально)

```bash
cd strapi
npm install
npm run develop
```

Админка: http://localhost:1337/admin — при первом запуске создайте учётную запись.

При первом старте Strapi автоматически:
- создаёт коллекцию `Product`
- импортирует меню из `strapi/seed/*.json`
- открывает публичный доступ к `GET /api/products`

### Strapi (Docker)

```bash
docker compose up --build
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|---|---|---|
| `REACT_APP_STRAPI_URL` | URL Strapi API | `http://localhost:1337` |

## Структура проекта

```
src/
  store/useMenuStore.js    # Zustand: корзина, меню, филиал
  services/api.js          # Strapi API + JSON fallback
  components/              # UI-компоненты
strapi/
  src/api/product/         # Content-type Product
  seed/                    # JSON для первичного импорта
docker-compose.yml
```

## Состояние (Zustand)

Глобальное состояние в `useMenuStore`:
- `productsGusto`, `productsAroma` — каталоги
- `order`, `amount` — корзина
- `branch` — текущий филиал (`gusto` / `aroma`)
- `loadProducts()` — загрузка из Strapi с fallback

## Дальнейшие шаги

1. Синхронизация меню iiko → Strapi (cron-задача)
2. Онлайн-оплата → отправка чека в iiko
3. Бронирование столиков
