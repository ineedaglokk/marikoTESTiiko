# Инструкция по интеграции iiko для доставки

Эта инструкция описывает как подключить систему доставки через iiko Cloud API к приложению "Хачапури Марико".

---

## Текущий статус интеграции

| Шаг | Статус | Примечание |
|-----|--------|------------|
| Шаг 1: Вход в iikoWeb | ✅ Готово | |
| Шаг 2: Создание API ключа | ✅ Готово | Ключ получен |
| Шаг 3: Получение Organization ID и Terminal Group ID | ✅ Готово | ID получены |
| Шаг 4: Настройка номенклатуры | ⏳ Ожидает | Нужна помощь поддержки iiko |
| Шаг 5: Добавление конфигурации в БД | ✅ Готово | Добавлено для nn-rozh |
| Шаг 6: Маппинг товаров | ⏳ Ожидает | После настройки номенклатуры |
| Шаг 7: Тестирование | ⏳ Ожидает | После маппинга товаров |

### Что сделано (29.01.2026):
- Backend задеплоен на Railway: `marikotestiiko-production.up.railway.app`
- БД PostgreSQL настроена и работает
- Загружено **24 города** и **32 ресторана**
- Создана таблица `restaurant_integrations`
- Добавлена конфигурация iiko для ресторана `nn-rozh` (Нижний Новгород, Рождественская, 39)

---

## Содержание

1. [Что такое iiko и зачем нужна интеграция](#что-такое-iiko-и-зачем-нужна-интеграция)
2. [Что нам предоставили](#что-нам-предоставили)
3. [Шаг 1: Вход в iikoWeb](#шаг-1-вход-в-iikoweb)
4. [Шаг 2: Создание API ключа](#шаг-2-создание-api-ключа)
5. [Шаг 3: Получение Organization ID и Terminal Group ID](#шаг-3-получение-organization-id-и-terminal-group-id)
6. [Шаг 4: Настройка номенклатуры (меню)](#шаг-4-настройка-номенклатуры-меню)
7. [Шаг 5: Добавление конфигурации в базу данных](#шаг-5-добавление-конфигурации-в-базу-данных)
8. [Шаг 6: Маппинг товаров](#шаг-6-маппинг-товаров)
9. [Шаг 7: Тестирование](#шаг-7-тестирование)
10. [Решение проблем](#решение-проблем)

---

## Что такое iiko и зачем нужна интеграция

**iiko** — это система автоматизации ресторанов. Когда клиент делает заказ в нашем приложении, заказ автоматически отправляется в iiko, где его видит кухня и курьеры.

**Без интеграции:** Заказ приходит → администратор вручную вводит его в iiko
**С интеграцией:** Заказ приходит → автоматически появляется в iiko

---

## Что нам предоставили

Для тестирования нам выдали демо-доступ к iiko:

| Параметр | Значение |
|----------|----------|
| CrmID | `8607660` |
| Домен BackOffice | https://353-003-988.iiko.it/resto/ |
| iikoWeb | https://353-003-988.iikoweb.ru/navigator/ru-RU/index.html#/main |
| Логин | `user` |
| Пароль | `user#test` |
| Пинкод | `1111` |

**Важно:** BackOffice — это Windows-приложение. Для macOS/Linux используем только iikoWeb (веб-интерфейс).

---

## Шаг 1: Вход в iikoWeb

### Статус: ✅ ГОТОВО

### Что делаем
Заходим в веб-интерфейс управления iiko.

### Как делаем

1. Открываем браузер
2. Переходим по ссылке: https://353-003-988.iikoweb.ru/navigator/ru-RU/index.html#/main
3. Вводим данные:
   - **Логин:** `user`
   - **Пароль:** `user#test`
4. Нажимаем **"Войти"**

### Результат
Попадаем в главное меню iikoWeb. Здесь видим разные разделы: Меню и цены, Внешние заказы, Интеграции и т.д.

---

## Шаг 2: Создание API ключа

### Статус: ✅ ГОТОВО

### Что делаем
Создаём специальный ключ для подключения нашего приложения к iiko.

### Как делаем

1. В iikoWeb находим раздел **"Внешние заказы"**
2. Переходим в **"Настройки Cloud API"**
3. Нажимаем **"Добавить интеграцию"** или **"Создать"**
4. Заполняем форму:
   - **Название:** `Mariko Delivery` (или любое понятное имя)
   - **Все права:** включаем (ставим галочку)
5. Подключаем ресторан:
   - Выбираем точку (например "Мой ресторан" в демо)
6. Нажимаем **"Сохранить"** или **"Создать"**

### Результат
После создания появится **API Ключ** — длинная строка типа:
```
0a646c4cb3da418aaf560d62d570f518
```

**ВАЖНО:** Скопируй и сохрани этот ключ! Он понадобится дальше.

### Наш API Ключ: `0a646c4cb3da418aaf560d62d570f518`

---

## Шаг 3: Получение Organization ID и Terminal Group ID

### Статус: ✅ ГОТОВО

### Что делаем
Получаем технические ID организации и терминала через API запросы.

### Как делаем

Открываем терминал (Terminal на Mac) и выполняем команды:

#### Запрос 1: Получаем токен доступа

```bash
curl -s -X POST "https://api-ru.iiko.services/api/1/access_token" \
  -H "Content-Type: application/json" \
  -d '{"apiLogin": "0a646c4cb3da418aaf560d62d570f518"}'
```

**Ответ будет примерно такой:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Копируем значение `token` (длинная строка).

#### Запрос 2: Получаем Organization ID

Заменяем `{TOKEN}` на скопированный токен:

```bash
curl -s -X POST "https://api-ru.iiko.services/api/1/organizations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{}'
```

**Ответ:**
```json
{
  "organizations": [
    {
      "id": "2e688113-401c-4d48-b28c-53852ece72aa",
      "name": "Мой ресторан"
    }
  ]
}
```

Копируем значение `id` — это **Organization ID**.

#### Запрос 3: Получаем Terminal Group ID

```bash
curl -s -X POST "https://api-ru.iiko.services/api/1/terminal_groups" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"organizationIds": ["2e688113-401c-4d48-b28c-53852ece72aa"]}'
```

**Ответ:**
```json
{
  "terminalGroups": [
    {
      "organizationId": "2e688113-401c-4d48-b28c-53852ece72aa",
      "items": [
        {
          "id": "dd70ac26-e6c9-9baf-019b-c1bdd21a0066",
          "name": "Основная группа"
        }
      ]
    }
  ]
}
```

Копируем `id` из `items` — это **Terminal Group ID**.

### Результат

| Параметр | Значение |
|----------|----------|
| API Login | `0a646c4cb3da418aaf560d62d570f518` |
| Organization ID | `2e688113-401c-4d48-b28c-53852ece72aa` |
| Terminal Group ID | `dd70ac26-e6c9-9baf-019b-c1bdd21a0066` |

---

## Шаг 4: Настройка номенклатуры (меню)

### Статус: ⏳ ОЖИДАЕТ (нужна помощь поддержки iiko)

### Что делаем
Создаём товары (блюда) в iiko, которые можно будет заказывать.

### Проблема с демо-стендом
В демо-версии iiko данные не синхронизируются с облаком без установки приложения **iiko Front** (работает только на Windows).

### Решение 1: Написать в поддержку iiko

Отправить письмо/сообщение в поддержку (туда, откуда пришли данные доступа):

```
Добрый день!

CrmID: 8607660

Для тестирования интеграции Cloud API прошу настроить демо-стенд с:
- Тестовой номенклатурой (несколько блюд с ценами)
- Настроенными типами оплаты

У меня macOS, поэтому не могу установить iiko Front для синхронизации.

Спасибо!
```

### Решение 2: Использовать реальный аккаунт iiko

Когда у ресторана будет реальный аккаунт iiko (не демо), там уже будет настроенная номенклатура.

### Как проверить номенклатуру через API

```bash
curl -s -X POST "https://api-ru.iiko.services/api/1/nomenclature" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"organizationId": "2e688113-401c-4d48-b28c-53852ece72aa"}'
```

Если `products` не пустой — номенклатура есть.

---

## Шаг 5: Добавление конфигурации в базу данных

### Статус: ✅ ГОТОВО

### Что сделано
Конфигурация добавлена через API endpoint на Railway.

### Текущая конфигурация в БД

| Поле | Значение |
|------|----------|
| restaurant_id | `nn-rozh` |
| provider | `iiko` |
| is_enabled | `true` |
| api_login | `0a646c4cb3da418aaf560d62d570f518` |
| organization_id | `2e688113-401c-4d48-b28c-53852ece72aa` |
| terminal_group_id | `dd70ac26-e6c9-9baf-019b-c1bdd21a0066` |

### Как добавить конфигурацию для других ресторанов

Использовать API endpoint (временный, для настройки):

```bash
curl -X POST "https://marikotestiiko-production.up.railway.app/api/db/add-iiko-config?key=mariko-iiko-setup-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "RESTAURANT_ID",
    "api_login": "0a646c4cb3da418aaf560d62d570f518",
    "organization_id": "2e688113-401c-4d48-b28c-53852ece72aa",
    "terminal_group_id": "dd70ac26-e6c9-9baf-019b-c1bdd21a0066"
  }'
```

### Доступные рестораны

Полный список можно получить через:
```bash
curl "https://marikotestiiko-production.up.railway.app/api/db/setup-iiko?key=mariko-iiko-setup-2024"
```

Основные рестораны:

| restaurant_id | Город | Адрес |
|---------------|-------|-------|
| `nn-rozh` | Нижний Новгород | Рождественская, 39 |
| `nn-park` | Нижний Новгород | Парк Швейцария |
| `nn-volga` | Нижний Новгород | Волжская набережная, 23а |
| `spb-sadovaya` | Санкт-Петербург | Малая Садовая, 3/54 |
| `spb-sennaya` | Санкт-Петербург | Сенная, 5 |
| `kazan-bulachnaya` | Казань | Право-Булачная, 33 |
| `kazan-pushkina` | Казань | Пушкина, 10 |

---

## Шаг 6: Маппинг товаров

### Статус: ⏳ ОЖИДАЕТ (после настройки номенклатуры в iiko)

### Что делаем
Сопоставляем ID товаров в нашей системе с ID товаров в iiko.

### Зачем это нужно
В нашей БД у товара ID типа `menu-item-123`, а в iiko у того же товара ID типа `abc-def-456`. Нужно связать их.

### Как делаем

#### 1. Получаем список товаров из iiko

```bash
# Сначала получаем токен
TOKEN=$(curl -s -X POST "https://api-ru.iiko.services/api/1/access_token" \
  -H "Content-Type: application/json" \
  -d '{"apiLogin": "0a646c4cb3da418aaf560d62d570f518"}' | jq -r '.token')

# Затем получаем номенклатуру
curl -s -X POST "https://api-ru.iiko.services/api/1/nomenclature" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"organizationId": "2e688113-401c-4d48-b28c-53852ece72aa"}' | jq '.products'
```

#### 2. Добавляем поле iiko_product_id в таблицу menu_items

```sql
-- Добавляем колонку для хранения iiko ID
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS iiko_product_id VARCHAR(255);

-- Обновляем конкретный товар
UPDATE menu_items
SET iiko_product_id = 'UUID_ИЗ_IIKO'
WHERE id = 'ID_ТОВАРА_В_НАШЕЙ_СИСТЕМЕ';
```

#### 3. Пример маппинга

| Наш ID | Название | iiko Product ID |
|--------|----------|-----------------|
| `item-001` | Хачапури по-аджарски | `abc123-def456-...` |
| `item-002` | Хинкали | `xyz789-qwe012-...` |

---

## Шаг 7: Тестирование

### Статус: ⏳ ОЖИДАЕТ (после маппинга товаров)

### Что делаем
Проверяем что заказы успешно отправляются в iiko.

### Как делаем

#### 1. Создаём тестовый заказ через API

```bash
# Получаем токен
TOKEN=$(curl -s -X POST "https://api-ru.iiko.services/api/1/access_token" \
  -H "Content-Type: application/json" \
  -d '{"apiLogin": "0a646c4cb3da418aaf560d62d570f518"}' | jq -r '.token')

# Создаем заказ
curl -s -X POST "https://api-ru.iiko.services/api/1/deliveries/create" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "organizationId": "2e688113-401c-4d48-b28c-53852ece72aa",
    "terminalGroupId": "dd70ac26-e6c9-9baf-019b-c1bdd21a0066",
    "order": {
      "orderServiceType": "DeliveryByCourier",
      "phone": "+79001234567",
      "customer": {
        "name": "Тестовый клиент"
      },
      "comment": "Тестовый заказ из Mariko App",
      "deliveryPoint": {
        "address": {
          "street": { "name": "Тестовая улица" },
          "house": "1"
        }
      },
      "items": [
        {
          "productId": "UUID_ТОВАРА_ИЗ_IIKO",
          "type": "Product",
          "amount": 1
        }
      ]
    }
  }'
```

#### 2. Проверяем в iikoWeb

Заходим в iikoWeb → Внешние заказы. Должен появиться наш тестовый заказ.

#### 3. Проверяем через приложение

Делаем заказ через мини-апп и смотрим появился ли он в iiko.

---

## Решение проблем

### Ошибка: "Login ... is not authorized"
**Причина:** Неправильный API Login
**Решение:** Проверь что копируешь именно API Login (длинная строка), а не название интеграции

### Ошибка: "Right api/1/orders/create is not allowed"
**Причина:** У API Login нет прав на создание заказов
**Решение:** В iikoWeb → Cloud API → открой интеграцию → включи "Все права"

### Ошибка: "request.order.items is null or empty"
**Причина:** Не указаны товары в заказе
**Решение:** Нужно добавить items с правильными productId из номенклатуры iiko

### Номенклатура пустая (products: [])
**Причина:** Данные не синхронизированы с облаком
**Решение:**
- Установить iiko Front (только Windows)
- Или попросить поддержку iiko настроить демо-стенд

### Терминалы пустые (terminalGroups: [])
**Причина:** Не настроена касса/терминал
**Решение:** В iikoWeb → Оборудование → добавить терминал

---

## Инфраструктура проекта

### Railway (Backend + PostgreSQL)

| Компонент | URL/Значение |
|-----------|--------------|
| Backend API | `https://marikotestiiko-production.up.railway.app` |
| PostgreSQL | Подключен к backend через DATABASE_URL |
| Project ID | `3225d8bb-782f-4ac1-b1a1-c43ba76f7e54` |

### Полезные API endpoints (временные, для настройки)

```bash
# Проверить состояние БД и список ресторанов
curl "https://marikotestiiko-production.up.railway.app/api/db/setup-iiko?key=mariko-iiko-setup-2024"

# Добавить конфигурацию iiko для ресторана
curl -X POST "https://marikotestiiko-production.up.railway.app/api/db/add-iiko-config?key=mariko-iiko-setup-2024" \
  -H "Content-Type: application/json" \
  -d '{"restaurant_id": "...", "api_login": "...", "organization_id": "...", "terminal_group_id": "..."}'

# Проверить таблицы в БД
curl "https://marikotestiiko-production.up.railway.app/api/db/check"
```

---

## Полезные ссылки

- **iiko Cloud API документация:** https://api-ru.iiko.services/
- **Справочник API методов:** https://ru.iiko.help/articles/api-documentations/
- **iikoWeb (наш демо):** https://353-003-988.iikoweb.ru/navigator/ru-RU/index.html#/main
- **Railway Dashboard:** https://railway.app

---

## Файлы интеграции в проекте

| Файл | Описание |
|------|----------|
| `backend/server/integrations/iiko-client.mjs` | Клиент для API iiko |
| `backend/server/services/integrationService.mjs` | Сервис отправки заказов |
| `backend/server/databaseInit.mjs` | Схема таблиц БД |
| `backend/server/data/cities.mjs` | Данные городов и ресторанов |

---

## Чеклист готовности к продакшену

- [x] API Login получен и работает
- [x] Organization ID и Terminal Group ID получены
- [ ] Номенклатура настроена в iiko (ожидает поддержки)
- [ ] Типы оплаты настроены
- [x] Конфигурация добавлена в БД (nn-rozh)
- [ ] Маппинг товаров сделан
- [ ] Тестовый заказ успешно создан
- [ ] Заказ появился в iikoWeb

---

## Следующие шаги

1. **Написать в поддержку iiko** для настройки номенклатуры на демо-стенде
2. **После получения номенклатуры:**
   - Получить список товаров через API
   - Сделать маппинг с товарами в нашей БД
   - Отправить тестовый заказ
3. **Настроить frontend** на Vercel
4. **Создать Telegram бота** для тестирования мини-аппа

---

*Последнее обновление: 29 января 2026*
