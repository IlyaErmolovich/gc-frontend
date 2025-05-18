import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import { getImageUrl } from '../utils/imageUtils';

const PageContainer = styled.div`
  padding: 0 15px;
  padding-top: 80px; /* Add padding-top to account for fixed header */
`;

const GameHeader = styled.div`
  position: relative;
  height: auto;
  min-height: 300px;
  border-radius: ${props => props.theme.radius.large};
  overflow: hidden;
  margin-bottom: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    min-height: 500px;
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  filter: blur(10px) brightness(30%);
`;

const GameContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  padding: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px 10px;
  }
`;

const GameCover = styled.div`
  width: 250px;
  height: 340px;
  border-radius: ${props => props.theme.radius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.large};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 180px;
    height: 240px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GameInfo = styled.div`
  flex: 1;
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
    margin-top: 20px;
  }
`;

const GameTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  margin-bottom: 10px;
  color: ${props => props.theme.colors.text};
`;

const GameDeveloper = styled.div`
  font-size: ${props => props.theme.fontSizes.medium};
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 15px;
`;

const GameDetails = styled.div`
  margin-top: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-bottom: 15px;
  }
`;

const DetailLabel = styled.div`
  width: 150px;
  color: ${props => props.theme.colors.textSecondary};
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    margin-bottom: 5px;
  }
`;

const DetailValue = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.text};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Tag = styled.span`
  background-color: rgba(123, 104, 238, 0.2);
  color: ${props => props.theme.colors.primary};
  padding: 6px 12px;
  border-radius: ${props => props.theme.radius.small};
  font-size: ${props => props.theme.fontSizes.small};
`;

const PlatformTag = styled(Tag)`
  background-color: rgba(75, 0, 130, 0.2);
  color: ${props => props.theme.colors.secondary};
`;

const AdminActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => props.danger ? props.theme.colors.error : props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 10px 20px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: opacity ${props => props.theme.transitions.short};
  
  &:hover {
    opacity: 0.8;
  }
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

const GamePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Параллельно запрашиваем данные игры и отзывы
        const [gameResponse, reviewsResponse] = await Promise.all([
          api.get(`/games/${id}`),
          api.get(`/reviews/game/${id}`)
        ]);
        
        setGame(gameResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError('Не удалось загрузить информацию об игре. Пожалуйста, попробуйте позже.');
        console.error('Error fetching game data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  const handleReviewAdded = async () => {
    try {
      // Обновляем список отзывов
      const response = await api.get(`/reviews/game/${id}`);
      setReviews(response.data);
    } catch (err) {
      console.error('Error refreshing reviews:', err);
    }
  };

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews(prev => prev.filter(review => review.id !== deletedReviewId));
  };

  const handleDeleteGame = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту игру? Это действие невозможно отменить.')) {
      try {
        await api.delete(`/games/${id}`);
        navigate('/');
      } catch (err) {
        alert('Ошибка при удалении игры');
        console.error('Error deleting game:', err);
      }
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (loading) {
    return <LoadingMessage>Загрузка информации об игре...</LoadingMessage>;
  }

  if (error || !game) {
    return <ErrorMessage>{error || 'Игра не найдена'}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <GameHeader>
        <BackgroundImage image={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/games/cover/${game.id}?t=${new Date().getTime()}`} />
        <GameContent>
          <GameCover>
            <img 
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/games/cover/${game.id}?t=${new Date().getTime()}`} 
              alt={game.title} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-game.jpg';
              }}
            />
          </GameCover>
          <GameInfo>
            <GameTitle>{game.title}</GameTitle>
            <GameDeveloper>{game.developper}</GameDeveloper>
            
            <GameDetails>
              <DetailRow>
                <DetailLabel>Издатель:</DetailLabel>
                <DetailValue>{game.publisher}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Дата выхода:</DetailLabel>
                <DetailValue>{formatDate(game.release_date)}</DetailValue>
              </DetailRow>
            </GameDetails>
            
            <TagsContainer>
              {game.genres && game.genres.map((genre, index) => (
                <Tag key={index}>{genre}</Tag>
              ))}
              {game.platforms && game.platforms.map((platform, index) => (
                <PlatformTag key={`p-${index}`}>{platform}</PlatformTag>
              ))}
            </TagsContainer>
            
            {isAdmin() && (
              <AdminActions>
                <Button onClick={() => navigate(`/admin/edit-game/${game.id}`)}>
                  Редактировать
                </Button>
                <Button danger onClick={handleDeleteGame}>
                  Удалить
                </Button>
              </AdminActions>
            )}
          </GameInfo>
        </GameContent>
      </GameHeader>
      
      {user ? (
        <ReviewForm gameId={id} onReviewAdded={handleReviewAdded} />
      ) : (
        <div style={{ textAlign: 'center', margin: '20px 0', color: '#AAAAAA' }}>
          Чтобы оставить отзыв, необходимо <a href="/login" style={{ color: '#7B68EE' }}>войти</a> или <a href="/register" style={{ color: '#7B68EE' }}>зарегистрироваться</a>
        </div>
      )}
      
      <ReviewList reviews={reviews} gameId={id} onReviewDeleted={handleReviewDeleted} />
    </PageContainer>
  );
};

export default GamePage; 