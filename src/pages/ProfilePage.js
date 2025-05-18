import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import ProfileForm from '../components/ProfileForm';
import api from '../api/config';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 0 15px;
  padding-top: 32px;
`;

const PageHeader = styled.h1`
  font-size: ${props => props.theme.fontSizes.xlarge};
  margin-bottom: 30px;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.large};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.error};
  background-color: rgba(255, 82, 82, 0.1);
  border-radius: ${props => props.theme.radius.medium};
  margin: 30px 0;
`;

const ProfilePage = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/users/profile');
        setUserData(response.data);
      } catch (err) {
        setError('Не удалось загрузить данные профиля. Пожалуйста, попробуйте позже.');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Перенаправляем неавторизованных пользователей
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading || loading) {
    return <LoadingMessage>Загрузка данных профиля...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <PageHeader>Мой профиль</PageHeader>
      {userData && <ProfileForm userData={userData} />}
    </PageContainer>
  );
};

export default ProfilePage; 