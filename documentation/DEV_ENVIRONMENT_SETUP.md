# Создание своего тестового окружения для разработки

Эта инструкция поможет создать полностью независимое окружение для тестирования, чтобы не зависеть от серверов товарища.

---

## Содержание

1. [Что нам нужно создать](#что-нам-нужно-создать)
2. [Выбор хостинга](#выбор-хостинга)
3. [Шаг 1: Клонирование проекта](#шаг-1-клонирование-проекта)
4. [Шаг 2: Создание Telegram бота](#шаг-2-создание-telegram-бота)
5. [Шаг 3: Настройка базы данных](#шаг-3-настройка-базы-данных)
6. [Шаг 4: Настройка хранилища файлов](#шаг-4-настройка-хранилища-файлов)
7. [Шаг 5: Деплой backend сервера](#шаг-5-деплой-backend-сервера)
8. [Шаг 6: Деплой Telegram бота](#шаг-6-деплой-telegram-бота)
9. [Шаг 7: Деплой frontend](#шаг-7-деплой-frontend)
10. [Шаг 8: Экспорт данных из продакшен БД](#шаг-8-экспорт-данных-из-продакшен-бд)
11. [Переменные окружения](#переменные-окружения)
12. [Локальная разработка](#локальная-разработка)

---

## Что нам нужно создать

| Компонент | Что это | Где разместить |
|-----------|---------|----------------|
| **PostgreSQL** | База данных | Railway / Supabase / Neon |
| **Backend Server** | Express.js API | Railway / Render / VPS |
| **Telegram Bot** | Telegraf бот | Railway / Render / VPS |
| **Frontend** | React SPA | Vercel / Netlify / Cloudflare Pages |
| **Object Storage** | Хранилище картинок | Yandex Cloud / S3 / Cloudflare R2 |

---

## Выбор хостинга

### Рекомендация: Railway (проще всего)

**Railway** — самый простой вариант. Всё в одном месте: БД, сервер, бот.

- **Цена:** $5/месяц (есть бесплатный пробный период)
- **Плюсы:** Простой деплой, автодеплой с GitHub, БД в комплекте
- **Минусы:** Серверы в США/Европе

### Альтернативы

#### Бесплатные варианты

| Сервис | БД | Backend | Frontend | Ограничения |
|--------|-----|---------|----------|-------------|
| **Render** | PostgreSQL (бесплатно) | Да | Да | Засыпает через 15 мин |
| **Supabase** | PostgreSQL (бесплатно) | Нет | Нет | 500MB БД, 2 проекта |
| **Neon** | PostgreSQL (бесплатно) | Нет | Нет | 0.5GB, засыпает |
| **Vercel** | Нет | Serverless | Да | Только frontend |
| **Netlify** | Нет | Serverless | Да | Только frontend |
| **Cloudflare Pages** | Нет | Workers | Да | Бесплатно, быстро |

#### Платные (недорогие)

| Сервис | Цена | Плюсы | Минусы |
|--------|------|-------|--------|
| **Railway** | от $5/мес | Всё в одном | Серверы не в РФ |
| **DigitalOcean** | от $4/мес | VPS, полный контроль | Нужно настраивать |
| **Timeweb Cloud** | от 199₽/мес | Русский, дешёвый | Нужно настраивать |
| **Selectel** | от 300₽/мес | Русский, надёжный | Сложнее |
| **REG.RU Cloud** | от 299₽/мес | Русский | Сложнее |

#### Русские хостинги (если важна скорость в РФ)

| Сервис | Цена VPS | БД | Плюсы |
|--------|----------|-----|-------|
| **Timeweb Cloud** | от 199₽/мес | PostgreSQL от 390₽ | Дёшево, просто |
| **Selectel** | от 300₽/мес | Managed PostgreSQL | Надёжно |
| **VK Cloud** | от 500₽/мес | PostgreSQL | Экосистема VK |
| **Yandex Cloud** | от 500₽/мес | PostgreSQL | Надёжно |

### Мой выбор для тестирования

**Самый простой путь:**
- **Railway** — backend + bot + PostgreSQL (всё в одном)
- **Vercel** — frontend (бесплатно)
- **Yandex Object Storage** — картинки (если уже есть)

**Бюджетный путь (всё бесплатно):**
- **Render** — backend + bot (бесплатно, но засыпает)
- **Supabase** или **Neon** — PostgreSQL (бесплатно)
- **Vercel** — frontend (бесплатно)
- **Cloudflare R2** — картинки (бесплатно до 10GB)

---

## Шаг 1: Клонирование проекта

### Если есть доступ к GitHub репозиторию

```bash
# Клонируем репозиторий
git clone https://github.com/marchelxyz/mariko_vld.git

# Или если уже клонирован, обновляем
cd mariko_vld
git pull origin main
```

### Создаём свою ветку для тестирования

```bash
# Создаём ветку для своих экспериментов
git checkout -b dev/iiko-testing

# Теперь можешь пушить сюда без страха сломать продакшен
git push -u origin dev/iiko-testing
```

### Если нужен отдельный репозиторий

```bash
# Форкаем репозиторий на GitHub (через веб-интерфейс)
# Или создаём новый репозиторий и копируем код

# Клонируем свой форк
git clone https://github.com/ТВОЙ_USERNAME/mariko_vld.git
```

---

## Шаг 2: Создание Telegram бота

### Что делаем
Создаём отдельного тестового бота, чтобы не мешать продакшен боту.

### Как делаем

1. Открываем Telegram
2. Ищем бота **@BotFather**
3. Отправляем команду `/newbot`
4. Вводим имя бота: `Mariko Test Bot` (или любое)
5. Вводим username: `mariko_test_dev_bot` (должен заканчиваться на `bot`)
6. Получаем **токен** вида: `7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Сохраняем токен

```
BOT_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Настройка WebApp URL

После деплоя frontend, возвращаемся к BotFather:

```
/mybots → выбираем бота → Bot Settings → Menu Button → Configure menu button
```

Вводим URL своего frontend: `https://твой-домен.vercel.app`

---

## Шаг 3: Настройка базы данных

### Вариант A: Railway (рекомендую)

1. Заходим на https://railway.app
2. Регистрируемся через GitHub
3. Нажимаем **"New Project"**
4. Выбираем **"Provision PostgreSQL"**
5. После создания, нажимаем на PostgreSQL сервис
6. Идём во вкладку **"Variables"**
7. Копируем **DATABASE_URL**

Формат будет такой:
```
postgresql://postgres:PASSWORD@HOST:PORT/railway
```

### Вариант B: Supabase (бесплатно)

1. Заходим на https://supabase.com
2. Создаём проект
3. Идём в **Settings → Database**
4. Копируем **Connection string (URI)**

### Вариант C: Neon (бесплатно)

1. Заходим на https://neon.tech
2. Создаём проект
3. Копируем **Connection string**

### Инициализация таблиц

Таблицы создадутся автоматически при первом запуске сервера (см. `databaseInit.mjs`).

Или можно создать вручную, выполнив SQL из файла `backend/server/databaseInit.mjs`.

---

## Шаг 4: Настройка хранилища файлов

### Если используешь тот же Yandex Object Storage

Можешь использовать те же ключи, что и в продакшене (если есть доступ).

### Создание своего бакета в Yandex Cloud

1. Заходим на https://console.cloud.yandex.ru
2. Создаём сервисный аккаунт
3. Создаём статический ключ доступа
4. Создаём бакет (bucket)

### Альтернатива: Cloudflare R2 (бесплатно до 10GB)

1. Заходим на https://dash.cloudflare.com
2. R2 → Create bucket
3. Создаём API токен

### Переменные для хранилища

```env
# Yandex Object Storage
YANDEX_STORAGE_ACCESS_KEY_ID=твой_access_key
YANDEX_STORAGE_SECRET_ACCESS_KEY=твой_secret_key
YANDEX_STORAGE_BUCKET_NAME=mariko-test-storage
YANDEX_STORAGE_REGION=ru-central1
YANDEX_STORAGE_ENDPOINT=https://storage.yandexcloud.net
YANDEX_STORAGE_PUBLIC_URL=https://storage.yandexcloud.net/mariko-test-storage
```

---

## Шаг 5: Деплой backend сервера

### Railway (рекомендую)

1. В Railway нажимаем **"New"** → **"GitHub Repo"**
2. Выбираем репозиторий `mariko_vld`
3. Railway автоматически определит проект
4. Настраиваем:
   - **Root Directory:** `backend/server`
   - **Start Command:** `node index.mjs`
5. Добавляем переменные окружения (см. раздел ниже)
6. Деплоим!

### Получаем URL сервера

После деплоя Railway даст URL типа:
```
https://mariko-server-test.up.railway.app
```

Сохраняем его — это `VITE_API_URL` для frontend.

---

## Шаг 6: Деплой Telegram бота

### Railway (отдельный сервис)

1. В том же проекте Railway нажимаем **"New"** → **"GitHub Repo"**
2. Выбираем тот же репозиторий
3. Настраиваем:
   - **Root Directory:** `backend/bot`
   - **Start Command:** `node index.mjs`
4. Добавляем переменные:
   - `BOT_TOKEN` — токен от BotFather
   - `WEBAPP_URL` — URL frontend (добавим после деплоя)
   - `API_URL` — URL backend сервера

---

## Шаг 7: Деплой frontend

### Vercel (рекомендую, бесплатно)

1. Заходим на https://vercel.com
2. **"Add New Project"**
3. Импортируем репозиторий с GitHub
4. Настраиваем:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Добавляем переменные окружения:
   ```
   VITE_API_URL=https://твой-backend.up.railway.app
   VITE_TELEGRAM_BOT_USERNAME=mariko_test_dev_bot
   ```
6. Деплоим!

### Получаем URL

Vercel даст URL типа:
```
https://mariko-test.vercel.app
```

### Обновляем бота

Возвращаемся к настройкам бота и указываем этот URL как WebApp URL.

---

## Шаг 8: Экспорт данных из продакшен БД

### Если есть доступ к продакшен БД

Попроси Рому выполнить экспорт или дать временный доступ.

#### Экспорт через pg_dump

```bash
# На машине с доступом к продакшен БД
pg_dump "postgresql://user:pass@host:port/dbname" > backup.sql

# Или только данные (без структуры)
pg_dump --data-only "postgresql://..." > data.sql

# Или конкретные таблицы
pg_dump -t cities -t restaurants -t menu_categories -t menu_items "postgresql://..." > menu_data.sql
```

#### Импорт в свою БД

```bash
# Импортируем в свою БД
psql "postgresql://postgres:pass@твой-host:port/railway" < backup.sql
```

### Если нет доступа к БД

Придётся создавать данные вручную или через админ-панель:

1. Запускаем приложение
2. Заходим в админ-панель
3. Создаём города, рестораны, меню

### Минимальные данные для тестирования

```sql
-- Создаём тестовый город
INSERT INTO cities (id, name, is_active, display_order)
VALUES ('test-city', 'Тестовый город', true, 1);

-- Создаём тестовый ресторан
INSERT INTO restaurants (id, city_id, name, address, is_active, is_delivery_enabled)
VALUES ('test-restaurant', 'test-city', 'Тестовый ресторан', 'ул. Тестовая, 1', true, true);

-- Создаём категорию меню
INSERT INTO menu_categories (id, restaurant_id, name, display_order, is_active)
VALUES ('test-category', 'test-restaurant', 'Тестовая категория', 1, true);

-- Создаём тестовое блюдо
INSERT INTO menu_items (id, category_id, name, description, price, is_active)
VALUES ('test-item-1', 'test-category', 'Тестовое блюдо', 'Описание', 500.00, true);
```

---

## Переменные окружения

### Backend Server (`backend/server`)

```env
# База данных
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway

# Порт сервера
PORT=3001

# CORS (URL фронтенда)
CORS_ORIGIN=https://твой-frontend.vercel.app

# Yandex Object Storage
YANDEX_STORAGE_ACCESS_KEY_ID=xxx
YANDEX_STORAGE_SECRET_ACCESS_KEY=xxx
YANDEX_STORAGE_BUCKET_NAME=mariko-test-storage
YANDEX_STORAGE_REGION=ru-central1
YANDEX_STORAGE_ENDPOINT=https://storage.yandexcloud.net
YANDEX_STORAGE_PUBLIC_URL=https://storage.yandexcloud.net/mariko-test-storage

# Telegram (для уведомлений)
TELEGRAM_BOT_TOKEN=7123456789:AAHxxx

# YooKassa (опционально, для платежей)
YOOKASSA_TEST_SHOP_ID=xxx
YOOKASSA_TEST_SECRET_KEY=xxx

# iiko (для интеграции)
IIKO_BASE_URL=https://api-ru.iiko.services
```

### Telegram Bot (`backend/bot`)

```env
# Токен бота
BOT_TOKEN=7123456789:AAHxxx

# URL WebApp (frontend)
WEBAPP_URL=https://твой-frontend.vercel.app

# URL API сервера
API_URL=https://твой-backend.up.railway.app
```

### Frontend (`frontend`)

```env
# URL API сервера
VITE_API_URL=https://твой-backend.up.railway.app

# Username бота (без @)
VITE_TELEGRAM_BOT_USERNAME=mariko_test_dev_bot

# VK App ID (если нужен VK Mini App)
VITE_VK_APP_ID=xxx
```

---

## Локальная разработка

### Запуск без серверов (полностью локально)

#### 1. Устанавливаем PostgreSQL локально

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb mariko_dev
```

**Или через Docker:**
```bash
docker run --name mariko-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

#### 2. Создаём файл `.env` для backend

```bash
cd backend/server
cp .env.example .env  # если есть пример
```

Содержимое `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mariko_dev
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

#### 3. Запускаем backend

```bash
cd backend/server
npm install
npm run dev
```

Сервер запустится на `http://localhost:3001`

#### 4. Запускаем frontend

```bash
cd frontend
npm install

# Создаём .env.local
echo "VITE_API_URL=http://localhost:3001" > .env.local

npm run dev
```

Frontend запустится на `http://localhost:5173`

#### 5. Тестируем в браузере

Открываем `http://localhost:5173` — приложение работает локально!

### Запуск бота локально

```bash
cd backend/bot
npm install

# Создаём .env
echo "BOT_TOKEN=твой_токен" > .env
echo "WEBAPP_URL=http://localhost:5173" >> .env
echo "API_URL=http://localhost:3001" >> .env

npm run dev
```

**Важно:** Для WebApp в Telegram нужен HTTPS. Локально можно использовать ngrok:

```bash
# Устанавливаем ngrok
brew install ngrok

# Пробрасываем localhost:5173 наружу
ngrok http 5173
```

Ngrok даст URL типа `https://abc123.ngrok.io` — его используем как WEBAPP_URL.

---

## Чеклист готовности

- [ ] Репозиторий склонирован
- [ ] Тестовый Telegram бот создан
- [ ] PostgreSQL развёрнут (Railway/Supabase/локально)
- [ ] Backend сервер развёрнут и работает
- [ ] Telegram бот развёрнут и отвечает
- [ ] Frontend развёрнут на Vercel
- [ ] WebApp URL настроен в боте
- [ ] Тестовые данные добавлены в БД
- [ ] Приложение открывается через Telegram

---

## Быстрый старт (TL;DR)

Если хочешь максимально быстро:

1. **Railway** — создаём проект, добавляем PostgreSQL
2. **Railway** — деплоим backend из `backend/server`
3. **Railway** — деплоим bot из `backend/bot`
4. **Vercel** — деплоим frontend из `frontend`
5. **BotFather** — создаём бота, настраиваем WebApp URL
6. Готово!

**Примерное время:** 30-60 минут
**Примерная стоимость:** $5/месяц (Railway) или бесплатно (с ограничениями)

---

*Последнее обновление: Январь 2026*
