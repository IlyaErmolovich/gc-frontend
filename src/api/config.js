import axios from 'axios';

// Определяем базовый URL в зависимости от окружения
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Увеличиваем тайм-аут до 30 секунд для работы с Render
  timeout: 30000
});

// Примечание: мы убрали interceptor для авторизации, 
// так как решили не использовать токены для упрощения

export default api; 