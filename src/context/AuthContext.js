import React, { createContext, useState, useEffect } from 'react';
import api from '../api/config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для очистки данных пользовательской сессии
  const clearUserSession = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      // Проверяем наличие сохраненных ошибок
      const savedError = localStorage.getItem('authError');
      if (savedError) {
        setError(savedError);
      }
      
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        try {
          // Получаем данные пользователя из localstorage для первичного отображения UI
          const cachedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          if (cachedUserData && cachedUserData.id) {
            setUser(cachedUserData);
          }

          // Получаем актуальные данные с сервера
          try {
            // Добавляем timestamp для предотвращения кэширования
            const timestamp = new Date().getTime();
            const response = await api.get(`/users/profile?t=${timestamp}`);
            
            if (response.data && response.data.user) {
              // Сравниваем полученные данные с кэшированными
              const newUserData = response.data.user;
              
              // Обновляем данные в localStorage и состоянии только если есть изменения
              localStorage.setItem('userData', JSON.stringify(newUserData));
              setUser(newUserData);
            }
          } catch (profileError) {
            console.error('Ошибка при получении профиля:', profileError);
            // Если произошла ошибка 401, очищаем сессию
            if (profileError.response && profileError.response.status === 401) {
              clearUserSession();
            }
          }
        } catch (err) {
          console.error('Ошибка проверки авторизации:', err);
          clearUserSession();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Регистрация
  const register = async (username, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', { username, password });
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      throw err;
    }
  };

  // Вход
  const login = async (username, password) => {
    try {
      setError(null);
      console.log("Отправляю запрос на логин:", { username, password });
      
      // Сначала очищаем текущую сессию для предотвращения конфликтов
      clearUserSession();
      // Очищаем предыдущие ошибки
      localStorage.removeItem('authError');
      
      const res = await api.post('/auth/login', { username, password });
      console.log("Получен ответ:", res.data);
      
      // Сохраняем данные пользователя без использования токена
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Получаем полные данные профиля
      try {
        const timestamp = new Date().getTime();
        const profileRes = await api.get(`/users/profile?t=${timestamp}`);
        if (profileRes.data && profileRes.data.user) {
          // Обновляем данные пользователя
          localStorage.setItem('userData', JSON.stringify(profileRes.data.user));
          setUser(profileRes.data.user);
        }
      } catch (profileErr) {
        console.error("Ошибка получения профиля:", profileErr);
      }

      return res.data;
    } catch (err) {
      console.error("Ошибка логина:", err);
      const errorMessage = err.response?.data?.message || 'Ошибка входа';
      setError(errorMessage);
      // Сохраняем ошибку в localStorage чтобы она не исчезала после перезагрузки страницы
      localStorage.setItem('authError', errorMessage);
      throw err;
    }
  };

  // Выход
  const logout = () => {
    clearUserSession();
  };

  // Обновление профиля
  const updateProfile = async (formData) => {
    try {
      setError(null);
      console.log('FormData содержимое:', [...formData.entries()]);
      
      // Важно: для FormData нужны правильные заголовки
      const res = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Ответ обновления профиля:', res.data);
      
      // Обновляем данные пользователя
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError(err.response?.data?.message || 'Ошибка обновления профиля');
      throw err;
    }
  };

  // Принудительное обновление профиля
  const refreshUserProfile = async () => {
    try {
      if (!user) return null;
      
      const timestamp = new Date().getTime();
      const response = await api.get(`/users/profile?t=${timestamp}`);
      
      if (response.data && response.data.user) {
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return null;
    }
  };

  // Проверка, является ли пользователь администратором
  const isAdmin = () => {
    return user && user.role_id === 1;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        refreshUserProfile,
        isAdmin,
        apiUrl: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 