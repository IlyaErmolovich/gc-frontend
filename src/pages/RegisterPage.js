import React from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

const PageContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 0 15px;
`;

const RegisterPage = () => {
  const { user } = useContext(AuthContext);
  
  // Если пользователь уже авторизован, перенаправляем его на главную страницу
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageContainer>
      <AuthForm isLogin={false} />
    </PageContainer>
  );
};

export default RegisterPage; 