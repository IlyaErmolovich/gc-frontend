import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const ReviewsContainer = styled.div`
  margin-top: 30px;
`;

const ReviewsTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 20px;
  color: ${props => props.theme.colors.text};
`;

const ReviewItem = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.radius.medium};
  padding: 20px;
  margin-bottom: 15px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Rating = styled.div`
  color: ${props => props.theme.colors.warning};
  font-size: 18px;
`;

const ReviewText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const ReviewActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  margin-left: 15px;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const NoReviews = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
  padding: 20px;
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.radius.medium};
`;

const ReviewList = ({ reviews, gameId, onReviewDeleted }) => {
  const { user, isAdmin } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      onReviewDeleted(reviewId);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при удалении отзыва');
    }
  };

  // Функция для отображения рейтинга в виде звезд
  const renderRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <ReviewsContainer>
      <ReviewsTitle>Отзывы ({reviews.length})</ReviewsTitle>
      
      {reviews.length === 0 ? (
        <NoReviews>Пока нет отзывов для этой игры. Будьте первым!</NoReviews>
      ) : (
        reviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <UserInfo>
                <UserAvatar>
                  {review.avatar ? (
                    <img src={getImageUrl(review.avatar)} alt={review.username} />
                  ) : (
                    <div style={{ background: '#4B0082', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      {review.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </UserAvatar>
                <UserName>{review.username}</UserName>
              </UserInfo>
              <Rating>{renderRating(review.raiting)}</Rating>
            </ReviewHeader>
            
            <ReviewText>{review.review_text}</ReviewText>
            
            {(user && (user.id === review.user_id || isAdmin())) && (
              <ReviewActions>
                <ActionButton onClick={() => handleDeleteReview(review.id)}>
                  Удалить
                </ActionButton>
              </ReviewActions>
            )}
          </ReviewItem>
        ))
      )}
    </ReviewsContainer>
  );
};

export default ReviewList; 