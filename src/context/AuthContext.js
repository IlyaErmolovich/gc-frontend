import React, { createContext, useState, useEffect } from 'react';
import api from '../api/config';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        try {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setUser(userData);
        } catch (err) {
          console.error('Ошибка проверки авторизации:', err);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('userData');
          setUser(null);
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
      const res = await api.post('/auth/login', { username, password });
      console.log("Получен ответ:", res.data);
      
      // Сохраняем данные пользователя без использования токена
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error("Ошибка логина:", err);
      setError(err.response?.data?.message || 'Ошибка входа');
      throw err;
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setUser(null);
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
        isAdmin,
        apiUrl: API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 