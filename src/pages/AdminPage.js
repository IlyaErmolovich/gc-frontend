import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../api/config';
import { AuthContext } from '../context/AuthContext';
import AdminGameForm from '../components/AdminGameForm';
import { getImageUrl } from '../utils/imageUtils';

const PageContainer = styled.div`
  max-width: 98%;
  margin: 50px auto;
  padding: 0 15px;
  padding-top: 30px; /* Additional padding for top */
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes.xlarge};
  color: ${props => props.theme.colors.text};
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
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

const GamesTable = styled.div`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.radius.medium};
  overflow: hidden;
  overflow-x: auto; /* Add horizontal scrolling for small screens */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: rgba(123, 104, 238, 0.1);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px 20px;
  text-align: left;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
`;

const TableCell = styled.td`
  padding: 15px 20px;
  color: ${props => props.theme.colors.text};
`;

const GameCover = styled.img`
  width: 50px;
  height: 70px;
  border-radius: ${props => props.theme.radius.small};
  object-fit: cover;
`;

const ActionsCell = styled.td`
  padding: 15px 20px;
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.danger 
    ? props.theme.colors.error 
    : props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 8px 12px;
  border-radius: ${props => props.theme.radius.small};
  font-size: ${props => props.theme.fontSizes.small};
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

// Add Card View for Mobile
const MobileCardView = styled.div`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: block;
  }
`;

const DesktopTableView = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const GameCard = styled.div`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.radius.medium};
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

const GameCardHeader = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const GameCardInfo = styled.div`
  margin-left: 15px;
  flex: 1;
`;

const GameCardTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.medium};
  margin-bottom: 5px;
  color: ${props => props.theme.colors.text};
`;

const GameCardDetail = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const GameCardLabel = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  margin-right: 5px;
  font-size: ${props => props.theme.fontSizes.small};
`;

const GameCardValue = styled.span`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.small};
`;

const GameCardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const AdminPage = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/games');
        setGames(response.data);
      } catch (err) {
        setError('Не удалось загрузить список игр. Пожалуйста, попробуйте позже.');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Если пользователь не авторизован или не админ, перенаправляем
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const handleAddGame = () => {
    setEditingGame(null);
    setShowAddForm(true);
  };

  const handleEditGame = (game) => {
    setEditingGame(game);
    setShowAddForm(true);
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту игру? Это действие невозможно отменить.')) {
      try {
        await api.delete(`/games/${gameId}`);
        
        // Обновляем список игр
        setGames(prev => prev.filter(game => game.id !== gameId));
      } catch (err) {
        alert('Ошибка при удалении игры');
        console.error('Error deleting game:', err);
      }
    }
  };

  const handleGameSaved = () => {
    // Обновляем список игр и скрываем форму
    setShowAddForm(false);
    setEditingGame(null);
    
    // Перезагружаем список игр
    setLoading(true);
    api.get('/games')
      .then(response => {
        setGames(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error refreshing games:', err);
        setLoading(false);
      });
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingGame(null);
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  if (showAddForm) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>{editingGame ? 'Редактирование игры' : 'Добавление новой игры'}</Title>
        </PageHeader>
        <AdminGameForm 
          game={editingGame} 
          onSave={handleGameSaved}
          onCancel={handleCancelForm}
        />
      </PageContainer>
    );
  }

  if (loading) {
    return <LoadingMessage>Загрузка списка игр...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <Title>Управление играми</Title>
        <AddButton onClick={handleAddGame}>Добавить игру</AddButton>
      </PageHeader>
      
      <DesktopTableView>
        <GamesTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Обложка</TableHeaderCell>
                <TableHeaderCell>Название</TableHeaderCell>
                <TableHeaderCell>Разработчик</TableHeaderCell>
                <TableHeaderCell>Издатель</TableHeaderCell>
                <TableHeaderCell>Дата выхода</TableHeaderCell>
                <TableHeaderCell>Действия</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {games.map(game => (
                <TableRow key={game.id}>
                  <TableCell>
                    <GameCover 
                      src={game.cover_image ? getImageUrl(game.cover_image) : '/placeholder-game.jpg'} 
                      alt={game.title} 
                    />
                  </TableCell>
                  <TableCell>{game.title}</TableCell>
                  <TableCell>{game.developper}</TableCell>
                  <TableCell>{game.publisher}</TableCell>
                  <TableCell>{formatDate(game.release_date)}</TableCell>
                  <ActionsCell>
                    <ActionButton onClick={() => handleEditGame(game)}>
                      Редактировать
                    </ActionButton>
                    <ActionButton danger onClick={() => handleDeleteGame(game.id)}>
                      Удалить
                    </ActionButton>
                    <ActionButton onClick={() => navigate(`/game/${game.id}`)}>
                      Просмотр
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </GamesTable>
      </DesktopTableView>
      
      <MobileCardView>
        {games.map(game => (
          <GameCard key={game.id}>
            <GameCardHeader>
              <GameCover 
                src={game.cover_image ? getImageUrl(game.cover_image) : '/placeholder-game.jpg'} 
                alt={game.title} 
              />
              <GameCardInfo>
                <GameCardTitle>{game.title}</GameCardTitle>
                <GameCardDetail>
                  <GameCardLabel>Разработчик:</GameCardLabel>
                  <GameCardValue>{game.developper}</GameCardValue>
                </GameCardDetail>
                <GameCardDetail>
                  <GameCardLabel>Издатель:</GameCardLabel>
                  <GameCardValue>{game.publisher}</GameCardValue>
                </GameCardDetail>
                <GameCardDetail>
                  <GameCardLabel>Дата выхода:</GameCardLabel>
                  <GameCardValue>{formatDate(game.release_date)}</GameCardValue>
                </GameCardDetail>
              </GameCardInfo>
            </GameCardHeader>
            <GameCardActions>
              <ActionButton onClick={() => handleEditGame(game)}>
                Редактировать
              </ActionButton>
              <ActionButton danger onClick={() => handleDeleteGame(game.id)}>
                Удалить
              </ActionButton>
              <ActionButton onClick={() => navigate(`/game/${game.id}`)}>
                Просмотр
              </ActionButton>
            </GameCardActions>
          </GameCard>
        ))}
      </MobileCardView>
    </PageContainer>
  );
};

export default AdminPage; 