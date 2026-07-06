# Strapi CMS — Menu Hookah

CMS для меню Gusto Lounge и Aroma.

## Content-type: Product

| Поле | Тип | Описание |
|---|---|---|
| uid | integer | ID из iiko |
| title | string | Название |
| price | integer | Цена |
| descr | text | Описание |
| gallery | string | Путь к изображению |
| category | string | Категория меню |
| branch | enum | `gusto` или `aroma` |
| editions | json | Варианты порций |
| sauce | json | Соусы |

## Запуск

```bash
npm install
npm run develop
```

При первом запуске:
1. Создайте admin-аккаунт на http://localhost:1337/admin
2. Меню автоматически импортируется из `seed/*.json`
3. Публичный API: `GET /api/products?filters[branch][$eq]=gusto`

## Docker

Из корня проекта:

```bash
docker compose up --build
```

## Seed

Файлы `seed/products-gusto.json` и `seed/products-aroma.json` — копии frontend JSON.
При пустой БД bootstrap в `src/index.ts` импортирует их автоматически.
