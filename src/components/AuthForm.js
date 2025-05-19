import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const FormContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  padding: 35px;
  background-color: rgba(29, 29, 31, 0.7);
  border-radius: ${props => props.theme.radius.medium};
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(123, 104, 238, 0.05);
`;

const FormTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xlarge};
  margin-bottom: 25px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  position: relative;
  padding-bottom: 15px;
  letter-spacing: 1px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(to right, rgba(32, 178, 170, 0.2), rgba(32, 178, 170, 0.8), rgba(32, 178, 170, 0.2));
  }
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
  font-size: 0.95rem;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
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

const Button = styled.button`
  background: linear-gradient(90deg, #20B2AA, #188F89);
  color: ${props => props.theme.colors.text};
  padding: 15px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(32, 178, 170, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    
    &:before {
      display: none;
    }
  }
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 25px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.95rem;
`;

const SwitchLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-weight: 600;
  transition: all ${props => props.theme.transitions.short};
  text-decoration: none;
  padding: 0 5px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: ${props => props.theme.colors.primary};
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
    
    &:after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  margin-bottom: 20px;
  font-size: ${props => props.theme.fontSizes.small};
  padding: 12px 15px;
  background-color: rgba(255, 82, 82, 0.1);
  border-radius: ${props => props.theme.radius.small};
  border-left: 3px solid ${props => props.theme.colors.error};
`;

const AuthForm = ({ isRegister = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(!isRegister);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (username.toLowerCase() === 'admin') {
          throw new Error('Пожалуйста, выберите другое имя пользователя');
        }
        await register(username, password);
      }
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.');
      // Оставляем сообщение об ошибке на экране, не сбрасываем его автоматически
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <FormContainer>
      <FormTitle>{isLogin ? 'Вход' : 'Регистрация'}</FormTitle>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
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
        
        <FormGroup>
          <Label htmlFor="password">Пароль</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
      </Form>
      
      <SwitchText>
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
        <SwitchLink onClick={toggleAuthMode}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </SwitchLink>
      </SwitchText>
    </FormContainer>
  );
};

export default AuthForm; 