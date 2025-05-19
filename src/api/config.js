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

// Добавляем интерцептор запросов для передачи данных пользователя
api.interceptors.request.use(
  config => {
    // Получаем данные пользователя из localStorage, если есть
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Если есть ID пользователя, добавляем в заголовки запроса
    if (userData && userData.id) {
      config.headers['user-id'] = userData.id;
      config.headers['username'] = userData.username || '';
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Функция для отправки формы с файлами
const uploadFormData = async (endpoint, formData, method = 'post') => {
  try {
    const url = `${baseURL}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    };
    
    // Добавляем информацию о пользователе в заголовки
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData && userData.id) {
      config.headers['user-id'] = userData.id;
      config.headers['username'] = userData.username || '';
    }
    
    console.log(`Отправка ${method.toUpperCase()} запроса на ${url} с FormData`);
    let response;
    
    if (method.toLowerCase() === 'put') {
      response = await axios.put(url, formData, config);
    } else {
      response = await axios.post(url, formData, config);
    }
    
    return response;
  } catch (error) {
    console.error('Ошибка при загрузке формы:', error);
    throw error;
  }
};

// Примечание: мы убрали interceptor для авторизации, 
// так как решили не использовать токены для упрощения

export default api;
export { uploadFormData }; 