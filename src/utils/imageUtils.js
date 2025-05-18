const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Формирует полный URL для изображения
 * @param {string|boolean|object} imageData - данные изображения или ID аватара
 * @param {string} fallback - запасное изображение, если данные не переданы
 * @param {number} userId - ID пользователя (используется с флагом avatar=true)
 * @returns {string} полный URL к изображению
 */
export const getImageUrl = (imageData, fallback = '/placeholder-game.jpg', userId = null) => {
  // Если данных нет, возвращаем запасное изображение
  if (!imageData) return fallback;
  
  // Если это булево значение true (новый формат аватаров)
  if (imageData === true && userId) {
    return `${API_URL}/api/users/avatar/${userId}?t=${new Date().getTime()}`; // Добавляем timestamp для предотвращения кэширования
  }
  
  // Если это объект с полем avatar_id (новый формат)
  if (typeof imageData === 'object' && imageData.avatar && imageData.avatar_id) {
    return `${API_URL}/api/users/avatar/${imageData.avatar_id}?t=${new Date().getTime()}`;
  }
  
  // Если есть поле avatar_id напрямую (для совместимости с новым форматом)
  if (typeof imageData === 'object' && imageData.avatar_id) {
    return `${API_URL}/api/users/avatar/${imageData.avatar_id}?t=${new Date().getTime()}`;
  }
  
  // Если путь уже полный URL, возвращаем его
  if (typeof imageData === 'string' && imageData.startsWith('http')) {
    return imageData;
  }
  
  // Для обратной совместимости со старыми путями к файлам
  if (typeof imageData === 'string') {
    return `${API_URL}${imageData}`;
  }
  
  // В остальных случаях возвращаем запасное изображение
  return fallback;
};

export default {
  getImageUrl
}; 