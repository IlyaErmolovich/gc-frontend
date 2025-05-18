import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const HeaderContainer = styled.header`
  background-color: rgba(29, 29, 31, 0.9);
  backdrop-filter: blur(10px);
  padding: 15px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(123, 104, 238, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 98%;
  margin: 0 auto;
  padding: 0 15px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  font-size: ${props => props.theme.fontSizes.large};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-right: auto;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: auto;
  }
`;

const NavLink = styled(Link)`
  margin-left: 25px;
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text};
  font-weight: 500;
  transition: color ${props => props.theme.transitions.short};
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 14px;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: width ${props => props.theme.transitions.short};
  }

  &:hover:after {
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 8px 16px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  transition: background-color ${props => props.theme.transitions.short}, transform ${props => props.theme.transitions.short};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 25px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin-left: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const NavLinks = styled.div`
  display: flex;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: ${props => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: rgba(29, 29, 31, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px;
    z-index: 100;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    
    ${NavLink} {
      margin: 10px 0;
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 25px;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text};
  transition: opacity ${props => props.theme.transitions.short};
  
  &:hover {
    opacity: 0.8;
  }
  
  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-right: 8px;
    object-fit: cover;
    border: 2px solid ${props => props.theme.colors.primary};
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 45px;
  background-color: rgba(29, 29, 31, 0.95);
  backdrop-filter: blur(10px);
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  border-radius: ${props => props.theme.radius.medium};
  padding: 5px 0;
  z-index: 100;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  border: 1px solid rgba(123, 104, 238, 0.1);
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: rgba(32, 178, 170, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: translateX(5px);
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: rgba(32, 178, 170, 0.1);
    color: ${props => props.theme.colors.primary};
    transform: translateX(5px);
  }
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">КАТАЛОГ ИГР</Logo>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          ☰
        </MobileMenuButton>
        
        <RightSection>
          <NavLinks isOpen={mobileMenuOpen}>
            <NavLink to="/" active={isActive('/')}>
              Популярные
            </NavLink>
            <NavLink to="/new" active={isActive('/new')}>
              Новинки
            </NavLink>
          </NavLinks>
          
          {user ? (
            <UserMenu>
              <UserButton onClick={toggleUserMenu}>
                {user.avatar ? (
                  <img 
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/avatar/${user.id}?t=${new Date().getTime()}`} 
                    alt={`${user.username}'s avatar`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-avatar.jpg';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#20B2AA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    border: '2px solid #20B2AA',
                    fontWeight: 'bold'
                  }}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </UserButton>
              
              <UserDropdown isOpen={userMenuOpen}>
                <DropdownItem to="/profile">Мой профиль</DropdownItem>
                {isAdmin() && (
                  <DropdownItem to="/admin">Админ панель</DropdownItem>
                )}
                <DropdownButton onClick={handleLogout}>Выйти</DropdownButton>
              </UserDropdown>
            </UserMenu>
          ) : (
            <Button onClick={() => navigate('/login')}>Войти</Button>
          )}
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 