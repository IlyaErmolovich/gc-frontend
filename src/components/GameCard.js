import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getImageUrl } from '../utils/imageUtils';

const Card = styled.div`
  background-color: rgba(29, 29, 31, 0.7);
  border-radius: ${props => props.theme.radius.medium};
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  transition: all ${props => props.theme.transitions.medium};
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid rgba(123, 104, 238, 0.05);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(32, 178, 170, 0.15);
    border-color: rgba(32, 178, 170, 0.2);
  }
`;

const CardImage = styled.div`
  height: 280px;
  overflow: hidden;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%);
    z-index: 1;
    opacity: 0.6;
    transition: opacity ${props => props.theme.transitions.medium};
  }
  
  ${Card}:hover &:before {
    opacity: 0.4;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${props => props.theme.transitions.medium};
  }
  
  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(to right, rgba(32, 178, 170, 0), rgba(32, 178, 170, 0.3), rgba(32, 178, 170, 0));
  }
`;

const CardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 12px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  line-height: 1.3;
`;

const CardInfo = styled.div`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.small};
  opacity: 0.8;
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
`;

const Tag = styled.span`
  background-color: rgba(32, 178, 170, 0.12);
  color: ${props => props.theme.colors.primary};
  padding: 5px 10px;
  border-radius: ${props => props.theme.radius.small};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  transition: all ${props => props.theme.transitions.short};
  backdrop-filter: blur(5px);
  
  &:hover {
    background-color: rgba(32, 178, 170, 0.25);
    transform: translateY(-2px);
  }
`;

const PlatformTag = styled(Tag)`
  background-color: rgba(123, 104, 238, 0.12);
  color: #9F91F6;
  
  &:hover {
    background-color: rgba(123, 104, 238, 0.25);
  }
`;

const ReleaseDate = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.colors.text};
  padding: 6px 10px;
  border-radius: ${props => props.theme.radius.small};
  font-size: 11px;
  font-weight: 600;
  z-index: 2;
  backdrop-filter: blur(5px);
  border-left: 2px solid ${props => props.theme.colors.primary};
  letter-spacing: 0.5px;
`;

const GameRating = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background-color: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.colors.warning};
  padding: 6px 10px;
  border-radius: ${props => props.theme.radius.small};
  font-weight: 600;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
  backdrop-filter: blur(5px);
  
  &:before {
    content: '★';
    color: ${props => props.theme.colors.warning};
  }
`;

const GameCard = ({ game }) => {
  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  // Если есть рейтинг, рассчитываем средний
  const calculateRating = () => {
    if (!game.reviews || game.reviews.length === 0) return null;
    const sum = game.reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / game.reviews.length).toFixed(1);
  };

  const rating = calculateRating();

  return (
    <Link to={`/game/${game.id}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <Card>
        <CardImage>
          <img 
            src={getImageUrl(game.cover_image, '/placeholder-game.jpg')} 
            alt={game.title} 
          />
          <ReleaseDate>{formatDate(game.release_date)}</ReleaseDate>
          {rating && <GameRating>{rating}</GameRating>}
        </CardImage>
        <CardContent>
          <CardTitle>{game.title}</CardTitle>
          <CardInfo>
            <div>Разработчик: {game.developper}</div>
          </CardInfo>
          <CardTags>
            {game.genres && game.genres.slice(0, 3).map((genre, index) => (
              <Tag key={index}>{genre}</Tag>
            ))}
            {game.platforms && game.platforms.slice(0, 2).map((platform, index) => (
              <PlatformTag key={`p-${index}`}>{platform}</PlatformTag>
            ))}
          </CardTags>
        </CardContent>
      </Card>
    </Link>
  );
};

export default GameCard; 