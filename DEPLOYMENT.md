# 🚀 Деплой проекта Хачапури Марико

## 📋 Архитектура

- **Frontend**: React SPA (порт 80, nginx)
- **Backend**: Telegram Bot (Node.js, PM2)  
- **Tunnel**: Cloudflare tunnel для HTTPS
- **Сервер**: Ubuntu 22.04 (85.198.83.72)

## 🔧 Компоненты

### Frontend (React)
- **Папка**: `/var/www/hm-project/`
- **Конфиг nginx**: `/etc/nginx/sites-available/hm-project`
- **Сборка**: `npm run build`

### Backend (Telegram Bot)
- **Папка**: `~/HM-projecttt/bot/`
- **Файл**: `main-bot.cjs`
- **Процесс**: PM2 `hachapuri-bot`
- **Логи**: `pm2 logs hachapuri-bot`

### Cloudflare Tunnel
- **Команда**: `cloudflared tunnel --url http://127.0.0.1:80`
- **Логи**: `/tmp/cloudflared.log`
- **URL**: Генерируется случайно при каждом запуске

## 🚀 Быстрый деплой

### 1. Деплой Frontend
```bash
# Локально
npm run build
scp -r dist/* root@85.198.83.72:/var/www/hm-project/

# На сервере
systemctl reload nginx
```

### 2. Деплой Bot
```bash
# Используй готовый скрипт
./deploy-bot.sh
```

### 3. Управление Tunnel
```bash
# Запуск tunnel
./manage-tunnel.sh start

# Получение URL
./manage-tunnel.sh url

# Обновление URL в боте
./manage-tunnel.sh update-bot https://new-url.trycloudflare.com
```

## 🔄 Процесс обновления

### При изменении Frontend:
1. `npm run build`
2. `scp dist/* root@85.198.83.72:/var/www/hm-project/`
3. `systemctl reload nginx`

### При изменении Bot:
1. Обнови `bot/main-bot.cjs`
2. `./deploy-bot.sh`

### При перезапуске сервера:
1. `./manage-tunnel.sh start` 
2. `./manage-tunnel.sh url` - получи новый URL
3. `./manage-tunnel.sh update-bot <новый-URL>`

## 🐛 Диагностика

### Проверка статуса:
```bash
# Nginx
ssh root@85.198.83.72 "systemctl status nginx"

# Bot
ssh root@85.198.83.72 "pm2 list"

# Tunnel  
./manage-tunnel.sh status
```

### Логи:
```bash
# Bot логи
ssh root@85.198.83.72 "pm2 logs hachapuri-bot"

# Nginx логи
ssh root@85.198.83.72 "tail -f /var/log/nginx/error.log"

# Tunnel логи
ssh root@85.198.83.72 "tail -f /tmp/cloudflared.log"
```

## ⚠️ Важные особенности

1. **Cloudflare tunnel URL меняется** при каждом перезапуске
2. **Bot должен быть обновлен** с новым URL после перезапуска tunnel
3. **PM2 автозапуск** настроен для бота
4. **Nginx автозапуск** настроен для frontend

## 🔐 Доступы

- **Сервер**: root@85.198.83.72
- **Bot**: @HachapuriMarico_BOT
- **Frontend**: https://текущий-tunnel-url.trycloudflare.com 