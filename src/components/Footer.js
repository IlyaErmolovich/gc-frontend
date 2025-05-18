import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.cardBg};
  padding: 30px 0;
  margin-top: 40px;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  margin-bottom: 20px;
  min-width: 200px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 30px;
  }
`;

const FooterTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 15px;
  font-size: ${props => props.theme.fontSizes.medium};
`;

const FooterLink = styled(Link)`
  display: block;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 8px;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FooterText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.textSecondary};
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>О нас</FooterTitle>
          <FooterText>
            Game Catalog - ваш путеводитель в мире игр. Мы собираем информацию о лучших играх на всех платформах.
          </FooterText>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Навигация</FooterTitle>
          <FooterLink to="/">Популярное</FooterLink>
          <FooterLink to="/new">Новинки</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Аккаунт</FooterTitle>
          <FooterLink to="/login">Вход</FooterLink>
          <FooterLink to="/register">Регистрация</FooterLink>
          <FooterLink to="/profile">Профиль</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        © {currentYear} Game Catalog. Все права защищены.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 