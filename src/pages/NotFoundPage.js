 
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
`;

const ErrorCode = styled.h1`
  font-size: 120px;
  font-weight: bold;
  margin: 0;
  color: ${props => props.theme.colors.primary};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 80px;
  }
`;

const Title = styled.h2`
  font-size: ${props => props.theme.fontSizes.xlarge};
  margin: 20px 0;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 30px;
  max-width: 600px;
  color: ${props => props.theme.colors.textSecondary};
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.radius.medium};
  text-decoration: none;
  font-weight: 500;
  transition: opacity ${props => props.theme.transitions.short};
  
  &:hover {
    opacity: 0.8;
  }
`;

const NotFoundPage = () => {
  return (
    <Container>
      <ErrorCode>404</ErrorCode>
      <Title>Страница не найдена</Title>
      <Description>
        Извините, но страница, которую вы ищете, не существует или была перемещена.
      </Description>
      <HomeLink to="/">Вернуться на главную</HomeLink>
    </Container>
  );
};

export default NotFoundPage; 