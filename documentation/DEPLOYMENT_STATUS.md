# Статус развёртывания и интеграции iiko

**Дата**: 31 января 2026
**Проект**: marikoTESTiiko

---

## Что работает

### Backend (Railway)
- **URL**: https://marikotestiiko-production.up.railway.app
- **Статус**: ✅ Работает
- **Health check**: `/api/health` → `{"status":"ok","database":true}`
- **PostgreSQL**: Подключена и работает
- **Города**: 24 города, 32 ресторана загружены

### Telegram Bot
- **Username**: @HachapuriMariko_BOT
- **Статус**: ✅ Работает (polling mode)
- **Web App**: Настроен

### Frontend (Vercel)
- **Статус**: ✅ Деплоится автоматически из main
- **Переменные окружения**: `VITE_SERVER_API_URL` настроена

### База данных
- **Таблица cities**: ✅ Создана, 24 города
- **Таблица restaurants**: ✅ Создана, 32 ресторана
- **Таблица restaurant_integrations**: ✅ Создана
- **Таблица admin_users**: ✅ Создана, добавлен super_admin (577222108)

### iiko интеграция для nn-rozh
- **API Login**: `0a646c4cb3da418aaf560d62d570f518` ✅ Работает (токен получается)
- **Organization ID**: `2e688113-401c-4d48-b28c-53852ece72aa`
- **Terminal Group ID**: `dd70ac26-e6c9-9baf-019b-c1bdd21a0066`
- **is_enabled**: true

### Исправленные баги
- **Онбординг**: ✅ Исправлен (добавлен localStorage fallback)

---

## Что НЕ работает / Требует внимания

### iiko номенклатура
- **Статус**: ❌ ПУСТО (0 продуктов, 0 групп, 0 типов оплаты)
- **Причина**: Меню не настроено в iiko Cloud для этой организации
- **Что нужно**:
  1. Связаться с поддержкой iiko или администратором iiko Cloud
  2. Убедиться что в организации `2e688113-401c-4d48-b28c-53852ece72aa` есть меню
  3. Проверить что ресторан привязан к правильной организации

### Маппинг продуктов
- **Статус**: ⏳ Ожидает номенклатуру
- **Что нужно**: После получения номенклатуры нужно связать локальные product_id с iiko_product_id

### Тип оплаты (Payment Type)
- **Статус**: ❌ Не настроен
- **Что нужно**: После получения списка payment_types выбрать нужный и добавить в конфиг

---

## Оставшиеся задачи

### 1. Получить номенклатуру из iiko (БЛОКЕР)
```bash
# Проверка текущего состояния
TOKEN=$(curl -s -X POST "https://api-ru.iiko.services/api/1/access_token" \
  -H "Content-Type: application/json" \
  -d '{"apiLogin":"0a646c4cb3da418aaf560d62d570f518"}' | jq -r '.token')

curl -s -X POST "https://api-ru.iiko.services/api/1/nomenclature" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"organizationId":"2e688113-401c-4d48-b28c-53852ece72aa"}' | jq '.products | length'
```
**Ожидаемый результат**: > 0 продуктов

### 2. Настроить типы оплаты
После появления номенклатуры проверить типы оплаты:
```bash
curl -s -X POST "https://api-ru.iiko.services/api/1/payment_types" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"organizationIds":["2e688113-401c-4d48-b28c-53852ece72aa"]}' | jq '.paymentTypes'
```

### 3. Обновить конфиг iiko с типом оплаты
```bash
curl -X POST "https://marikotestiiko-production.up.railway.app/api/db/add-iiko-config?key=mariko-iiko-setup-2024" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurantId": "nn-rozh",
    "apiLogin": "0a646c4cb3da418aaf560d62d570f518",
    "organizationId": "2e688113-401c-4d48-b28c-53852ece72aa",
    "terminalGroupId": "dd70ac26-e6c9-9baf-019b-c1bdd21a0066",
    "defaultPaymentType": "<PAYMENT_TYPE_ID>"
  }'
```

### 4. Создать маппинг продуктов
Нужно будет создать таблицу или конфиг для маппинга:
- Локальный product_id (из нашего меню) → iiko_product_id

### 5. Протестировать заказ
После настройки всего выше - создать тестовый заказ через приложение.

---

## Полезные команды

### Проверка статуса iiko конфига
```bash
curl -s "https://marikotestiiko-production.up.railway.app/api/db/setup-iiko?key=mariko-iiko-setup-2024" | jq '.results.existingIntegrations'
```

### Проверка здоровья бэкенда
```bash
curl -s "https://marikotestiiko-production.up.railway.app/api/health"
```

### Проверка городов
```bash
curl -s "https://marikotestiiko-production.up.railway.app/api/cities/active" | jq 'length'
```

---

## Контакты и ресурсы

- **iiko Cloud API**: https://api-ru.iiko.services
- **iiko документация**: https://api-ru.iiko.services/swagger/ui/index
- **Railway Dashboard**: railway.app
- **Vercel Dashboard**: vercel.com
- **Telegram Bot**: @HachapuriMariko_BOT

---

## Следующий шаг

**ГЛАВНОЕ**: Нужно настроить номенклатуру в iiko Cloud. Без этого заказы не смогут быть созданы, т.к. нет product_id для товаров.

Варианты:
1. Обратиться в поддержку iiko для настройки меню
2. Проверить правильность Organization ID (возможно это тестовая организация без меню)
3. Убедиться что API Login имеет доступ к нужной организации
