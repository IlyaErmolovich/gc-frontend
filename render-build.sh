#!/usr/bin/env bash
# Скрипт для сборки проекта на Render

# Сборка React приложения
npm install && npm run build

# Копирование правил редиректа
cp public/_redirects build/
cp public/vercel.json build/
cp public/netlify.toml build/
cp static.json build/

# Создаем файл для Render
echo "/* /index.html 200" > build/_redirects 