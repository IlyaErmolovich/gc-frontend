const express = require('express');
const path = require('path');
const app = express();

// Порт по умолчанию для приложения
const PORT = process.env.PORT || 3000;

// Установка каталога для статических файлов
app.use(express.static(path.join(__dirname, 'build')));

// Настройка CORS - разрешаем запросы с любого источника
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, user-id, username, Origin');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 часа в секундах
  
  // Предварительная проверка OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Добавляем заголовки для кэширования
app.use((req, res, next) => {
  // Запрещаем кэширование для динамического контента
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    // Разрешаем кэширование для статики
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 день
  }
  next();
});

// Все запросы перенаправляем на index.html
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(500).send('Внутренняя ошибка сервера');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 