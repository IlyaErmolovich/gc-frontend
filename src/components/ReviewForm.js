import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api/config';

const FormContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.radius.medium};
  padding: 20px;
  margin-bottom: 30px;
`;

const FormTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const RatingContainer = styled.div`
  margin-bottom: 15px;
`;

const RatingLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.textSecondary};
`;

const RatingStars = styled.div`
  display: flex;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => (props.active ? props.theme.colors.warning : props.theme.colors.textSecondary)};
  cursor: pointer;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.warning};
  }
`;

const TextareaContainer = styled.div`
  margin-bottom: 20px;
`;

const TextareaLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.textSecondary};
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radius.small};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
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

const ReviewForm = ({ gameId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка данных формы
    if (rating === 0) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }
    
    if (reviewText.trim().length < 10) {
      setError('Отзыв должен содержать не менее 10 символов');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      await api.post(`/reviews/game/${gameId}`, {
        raiting: rating,
        reviewText
      });
      
      setSuccess('Ваш отзыв успешно добавлен');
      setRating(0);
      setReviewText('');
      
      // Обновляем список отзывов в родительском компоненте
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormTitle>Оставить отзыв</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <RatingContainer>
          <RatingLabel>Ваша оценка:</RatingLabel>
          <RatingStars>
            {[1, 2, 3, 4, 5].map((value) => (
              <StarButton
                key={value}
                type="button"
                active={value <= rating}
                onClick={() => handleRatingClick(value)}
              >
                ★
              </StarButton>
            ))}
          </RatingStars>
        </RatingContainer>
        
        <TextareaContainer>
          <TextareaLabel>Ваш отзыв:</TextareaLabel>
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Поделитесь своим мнением об игре..."
            required
          />
        </TextareaContainer>
        
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </SubmitButton>
      </Form>
    </FormContainer>
  );
};

export default ReviewForm; 