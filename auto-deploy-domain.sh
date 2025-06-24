#!/bin/bash

# 🚀 Автодеплой Хачапури Марико с постоянным доменом

set -e  # Выход при ошибке

SERVER="root@85.198.83.72"
BOT_DIR="~/hachapuri-bot"
WEB_DIR="/var/www/html"
DOMAIN="https://ineedaglokk.ru"

echo "🍴 === АВТОДЕПЛОЙ ХАЧАПУРИ МАРИКО (ДОМЕН) ==="
echo ""
echo "🌐 Используем постоянный домен: $DOMAIN"
echo ""

# 1. СБОРКА ФРОНТЕНДА
echo "📦 1. Собираем фронтенд..."
npm run build

# 2. ДЕПЛОЙ ФРОНТЕНДА
echo "🚀 2. Деплоим фронтенд на сервер..."
rsync -avz --delete dist/ $SERVER:$WEB_DIR/

# 3. ОЧИСТКА КЕША CLOUDFLARE
if [[ -n "$CLOUDFLARE_API_TOKEN" && -n "$CLOUDFLARE_ZONE_ID" ]]; then
  echo "🧹 3. Очищаем кеш Cloudflare..."
  # По умолчанию очищаем index.html и манифест статики. При необходимости можно расширить список.
  purge_payload=$(cat <<EOF
{
  "files": [
    "$DOMAIN/index.html",
    "$DOMAIN"
  ]
}
EOF
)
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
       -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
       -H "Content-Type: application/json" \
       --data "$purge_payload" | grep -q '"success":true' && \
       echo "✅ Кеш Cloudflare очищен" || echo "⚠️  Не удалось очистить кеш Cloudflare" 
else
  echo "⚠️  CLOUDFLARE_API_TOKEN или CLOUDFLARE_ZONE_ID не заданы. Пропускаем очистку кеша Cloudflare."
fi

# 4. ПРОВЕРКА КОНФИГУРАЦИИ БОТА НА СЕРВЕРЕ
echo "🤖 4. Проверяем конфигурацию бота на сервере..."
ssh $SERVER "if [ ! -f $BOT_DIR/.env ]; then echo '🔴 ВАЖНО: Файл .env не найден на сервере в директории $BOT_DIR. Без него бот не запустится. Загрузите его вручную и наполните необходимыми переменными (BOT_TOKEN, WEBAPP_URL).'; exit 1; else echo '✅ Файл .env найден на сервере.'; fi"

# 5. ДЕПЛОЙ БОТА
echo "🚀 5. Деплоим бота на сервер..."

# Останавливаем бот
ssh $SERVER "pm2 stop hachapuri-bot 2>/dev/null || true"

# Создаем директорию если не существует
ssh $SERVER "mkdir -p $BOT_DIR"

# Загружаем только файлы кода, НЕ .env
echo "📦 Загружаем файлы кода бота..."
scp bot/main-bot.cjs bot/package.json $SERVER:$BOT_DIR/

# Обновляем зависимости
ssh $SERVER "cd $BOT_DIR && npm install"

# 6. ЗАПУСК БОТА
echo "▶️  6. Запускаем бота..."
ssh $SERVER "cd $BOT_DIR && pm2 start main-bot.cjs --name hachapuri-bot || pm2 restart hachapuri-bot"

# 7. НАСТРОЙКА АВТОЗАПУСКА
echo "⚙️  7. Настраиваем автозапуск..."
ssh $SERVER "pm2 save && pm2 startup systemd -u root --hp /root 2>/dev/null || true"

# 8. ПРОВЕРКА СТАТУСА
echo "✅ 8. Проверяем статус..."
echo ""
echo "📊 Статус PM2:"
ssh $SERVER "pm2 list"
echo ""
echo "🌐 URL приложения: $DOMAIN"
echo "🤖 Бот: @HachapuriMarico_BOT"
echo ""

# 9. ПОКАЗ ЛОГОВ
echo "📋 Логи бота (последние 5 строк):"
ssh $SERVER "pm2 logs hachapuri-bot --lines 5 --nostream 2>/dev/null || echo 'Логи пока недоступны'"

echo ""
echo "🎉 === ДЕПЛОЙ ЗАВЕРШЕН ==="
echo ""
echo "🔧 Полезные команды:"
echo "   • Логи бота: ssh $SERVER 'pm2 logs hachapuri-bot'"
echo "   • Рестарт бота: ssh $SERVER 'pm2 restart hachapuri-bot'"
echo "   • Статус: ssh $SERVER 'pm2 list'"
echo "   • Проверка сайта: curl -I $DOMAIN"
echo ""
echo "✨ Ваш проект готов к работе!"
echo "" 