import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import api from '../api/config';
import GameCard from '../components/GameCard';
import GameFilter from '../components/GameFilter';

const PageContainer = styled.div`
  max-width: 98%;
  margin: 0 auto;
  padding: 0 15px;
  padding-top: 80px;
`;

const PageTitle = styled.h1`
  font-size: ${props => props.theme.fontSizes.xxlarge};
  margin-bottom: 30px;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.medium};
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.error};
  background-color: rgba(255, 82, 82, 0.1);
  border-radius: ${props => props.theme.radius.medium};
  margin: 30px 0;
`;

const NoGamesMessage = styled.div`
  text-align: center;
  padding: 50px;
  color: ${props => props.theme.colors.textSecondary};
  background-color: ${props => props.theme.colors.cardBg};
  border-radius: ${props => props.theme.radius.medium};
  margin: 30px 0;
`;

const LoadMoreSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  
  &:after {
    content: "";
    display: block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid ${props => props.theme.colors.primary};
    border-color: ${props => props.theme.colors.primary} transparent ${props => props.theme.colors.primary} transparent;
    animation: spin 1.2s linear infinite;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const NewGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    title: '',
    genre: '',
    platform: '',
    sort: 'newest'
  });
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const observer = useRef();
  const lastGameElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreGames();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);
  
  // Load initial games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setInitialLoading(true);
        setError(null);
        
        // Reset games and page when filters change
        setGames([]);
        setPage(1);
        
        const params = { ...filters, page: 1, limit: 12 };
        const response = await api.get('/games', { params });
        
        setGames(response.data);
        setHasMore(response.data.length === 12);
      } catch (err) {
        setError('Не удалось загрузить игры. Пожалуйста, попробуйте позже.');
        console.error('Error fetching games:', err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchGames();
  }, [filters]);
  
  // Function to load more games
  const loadMoreGames = async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      
      const params = { ...filters, page: nextPage, limit: 12 };
      const response = await api.get('/games', { params });
      
      if (response.data.length > 0) {
        setGames(prevGames => [...prevGames, ...response.data]);
        setPage(nextPage);
        setHasMore(response.data.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more games:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Preserve sorting by newest
    setFilters({...newFilters, sort: 'newest'});
  };

  return (
    <PageContainer>
      <PageTitle>Новинки</PageTitle>
      
      <GameFilter onFilterChange={handleFilterChange} />
      
      {initialLoading ? (
        <LoadingMessage>Загрузка игр...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : games.length === 0 ? (
        <NoGamesMessage>Игры не найдены. Попробуйте изменить параметры фильтра.</NoGamesMessage>
      ) : (
        <>
          <GamesGrid>
            {games.map((game, index) => {
              // Add ref to the last item for infinite scroll
              if (games.length === index + 1) {
                return (
                  <div key={game.id} ref={lastGameElementRef}>
                    <GameCard game={game} />
                  </div>
                );
              } else {
                return <GameCard key={game.id} game={game} />;
              }
            })}
          </GamesGrid>
          
          {loadingMore && <LoadMoreSpinner />}
        </>
      )}
    </PageContainer>
  );
};

export default NewGamesPage; 