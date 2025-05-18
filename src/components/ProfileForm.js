import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 30px;
  background-color: rgba(29, 29, 31, 0.7);
  border-radius: ${props => props.theme.radius.medium};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(123, 104, 238, 0.05);
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.large};
  margin-bottom: 25px;
  color: ${props => props.theme.colors.text};
  position: relative;
  padding-bottom: 15px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid rgba(123, 104, 238, 0.1);
  border-radius: ${props => props.theme.radius.medium};
  background-color: rgba(255, 255, 255, 0.03);
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(32, 178, 170, 0.2);
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const AvatarPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 25px;
  background-color: rgba(32, 178, 170, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.xlarge};
  border: 3px solid ${props => props.theme.colors.primary};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 12px 20px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 14px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  margin-top: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: 20px;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 12px;
  background-color: rgba(255, 82, 82, 0.1);
  border-radius: ${props => props.theme.radius.small};
  border-left: 3px solid ${props => props.theme.colors.error};
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  margin-bottom: 20px;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 12px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: ${props => props.theme.radius.small};
  border-left: 3px solid ${props => props.theme.colors.success};
`;

const ProfileForm = ({ userData }) => {
  const { user, updateProfile } = useContext(AuthContext);
  const [username, setUsername] = useState(userData?.user?.username || user?.username || '');
  const [avatar, setAvatar] = useState(null);
  
  // Получаем URL аватара
  const getUserAvatarUrl = () => {
    // Проверяем userData
    if (userData?.user?.avatar && userData?.user?.avatar_id) {
      // Новый формат
      return getImageUrl({ avatar: true, avatar_id: userData.user.avatar_id });
    } else if (userData?.user?.avatar === true && userData?.user?.id) {
      // Другой новый формат - булево значение с ID
      return getImageUrl(true, null, userData.user.id);
    } else if (userData?.user?.avatar) {
      // Старый формат - путь к файлу
      return getImageUrl(userData.user.avatar);
    }
    
    // Проверяем user из контекста
    if (user?.avatar && user?.avatar_id) {
      return getImageUrl({ avatar: true, avatar_id: user.avatar_id });
    } else if (user?.avatar === true && user?.id) {
      return getImageUrl(true, null, user.id);
    } else if (user?.avatar) {
      return getImageUrl(user.avatar);
    }
    
    return null;
  };
  
  const [previewUrl, setPreviewUrl] = useState(getUserAvatarUrl());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Обновляем URL аватара при изменении пользователя
  useEffect(() => {
    const avatarUrl = getUserAvatarUrl();
    if (avatarUrl && !avatar) { // Не обновляем, если уже выбран новый аватар
      setPreviewUrl(avatarUrl);
    }
  }, [user, userData]);
  
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      
      // Создаем URL для предварительного просмотра
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Имя пользователя не может быть пустым');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      
      if (avatar) {
        // Убедимся, что имя поля точно совпадает с тем, что ожидает multer
        formData.append('avatar', avatar);
        console.log('Добавляем файл аватара:', avatar.name);
      }
      
      console.log('Отправляем запрос на обновление профиля');
      const result = await updateProfile(formData);
      console.log('Результат обновления:', result);
      setSuccess('Профиль успешно обновлен');
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Редактирование профиля</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <AvatarContainer>
          <AvatarPreview>
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar Preview" />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </AvatarPreview>
          
          <AvatarUpload>
            <UploadButton 
              type="button" 
              onClick={() => fileInputRef.current.click()}
            >
              Выбрать аватар
            </UploadButton>
            <FileInput
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <span style={{ color: '#AAAAAA', fontSize: '0.8rem' }}>
              Рекомендуемый размер: 200x200 px
            </span>
          </AvatarUpload>
        </AvatarContainer>
        
        <FormGroup>
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ProfileForm; 