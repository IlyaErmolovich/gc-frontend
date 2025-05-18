import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../api/config';
import { getImageUrl } from '../utils/imageUtils';

const FormContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.radius.medium};
  padding: 20px;
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radius.small};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radius.small};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
  
  option {
    background-color: ${props => props.theme.colors.cardBg};
  }
`;

const MultiSelect = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radius.small};
  background-color: rgba(255, 255, 255, 0.05);
  padding: 10px;
  max-height: 150px;
  overflow-y: auto;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  input {
    margin-right: 8px;
  }
`;

const CoverPreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: ${props => props.theme.radius.small};
  overflow: hidden;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 8px 16px;
  border-radius: ${props => props.theme.radius.small};
  font-weight: 500;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
  margin-bottom: 8px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 12px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: 15px;
  font-size: ${props => props.theme.fontSizes.small};
`;

const SuccessMessage = styled.div`
  color: ${props => props.theme.colors.success};
  margin-bottom: 15px;
  font-size: ${props => props.theme.fontSizes.small};
`;

const AdminGameForm = ({ game = null, onGameAdded, onGameUpdated }) => {
  const [title, setTitle] = useState(game ? game.title : '');
  const [developer, setDeveloper] = useState(game ? game.developper : '');
  const [publisher, setPublisher] = useState(game ? game.publisher : '');
  const [releaseDate, setReleaseDate] = useState(game ? game.release_date.split('T')[0] : '');
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(game && game.cover_image ? getImageUrl(game.cover_image) : null);
  const [selectedGenres, setSelectedGenres] = useState(game ? game.genres : []);
  const [selectedPlatforms, setSelectedPlatforms] = useState(game ? game.platforms : []);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef();

  // Загрузка жанров и платформ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          api.get('/games/genres/all'),
          api.get('/games/platforms/all')
        ]);
        setGenres(genresRes.data);
        setPlatforms(platformsRes.data);
      } catch (err) {
        setError('Ошибка загрузки данных');
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      
      // Создаем URL для предварительного просмотра
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedGenres(prev => [...prev, value]);
    } else {
      setSelectedGenres(prev => prev.filter(genre => genre !== value));
    }
  };

  const handlePlatformChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedPlatforms(prev => [...prev, value]);
    } else {
      setSelectedPlatforms(prev => prev.filter(platform => platform !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка данных формы
    if (!title || !developer || !publisher || !releaseDate) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    if (selectedGenres.length === 0 || selectedPlatforms.length === 0) {
      setError('Выберите хотя бы один жанр и одну платформу');
      return;
    }
    
    if (!game && !coverImage) {
      setError('Загрузите обложку игры');
      return;
    }
    
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('developer', developer);
      formData.append('publisher', publisher);
      formData.append('release_date', releaseDate);
      
      selectedGenres.forEach(genre => {
        formData.append('genres', genre);
      });
      
      selectedPlatforms.forEach(platform => {
        formData.append('platforms', platform);
      });
      
      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      
      let response;
      if (game) {
        // Обновление существующей игры
        response = await api.put(`/games/${game.id}`, formData);
        setSuccess('Игра успешно обновлена');
        if (onGameUpdated) onGameUpdated(response.data.game);
      } else {
        // Создание новой игры
        response = await api.post('/games', formData);
        setSuccess('Игра успешно добавлена');
        
        // Сброс формы
        setTitle('');
        setDeveloper('');
        setPublisher('');
        setReleaseDate('');
        setCoverImage(null);
        setPreviewUrl(null);
        setSelectedGenres([]);
        setSelectedPlatforms([]);
        
        if (onGameAdded) onGameAdded(response.data.game);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при сохранении игры');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>{game ? 'Редактирование игры' : 'Добавление новой игры'}</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label htmlFor="title">Название игры *</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="developer">Разработчик *</Label>
            <Input
              type="text"
              id="developer"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="publisher">Издатель *</Label>
            <Input
              type="text"
              id="publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label htmlFor="releaseDate">Дата выхода *</Label>
            <Input
              type="date"
              id="releaseDate"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <Label>Жанры *</Label>
            <MultiSelect>
              {genres.map(genre => (
                <CheckboxLabel key={genre.id}>
                  <input
                    type="checkbox"
                    value={genre.name}
                    checked={selectedGenres.includes(genre.name)}
                    onChange={handleGenreChange}
                  />
                  {genre.name}
                </CheckboxLabel>
              ))}
            </MultiSelect>
          </FormGroup>
          
          <FormGroup>
            <Label>Платформы *</Label>
            <MultiSelect>
              {platforms.map(platform => (
                <CheckboxLabel key={platform.id}>
                  <input
                    type="checkbox"
                    value={platform.name}
                    checked={selectedPlatforms.includes(platform.name)}
                    onChange={handlePlatformChange}
                  />
                  {platform.name}
                </CheckboxLabel>
              ))}
            </MultiSelect>
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <Label>Обложка игры *</Label>
          <CoverPreview>
            {previewUrl ? (
              <img src={previewUrl} alt="Cover Preview" />
            ) : (
              'Нет изображения'
            )}
          </CoverPreview>
          <UploadButton 
            type="button" 
            onClick={() => fileInputRef.current.click()}
          >
            {game ? 'Изменить обложку' : 'Загрузить обложку'}
          </UploadButton>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
        </FormGroup>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : game ? 'Обновить игру' : 'Добавить игру'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default AdminGameForm; 