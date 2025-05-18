import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api/config';

const FilterButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const FilterButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  padding: 10px 20px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
    transform: translateY(-2px);
  }
`;

const FilterSidebar = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 380px;
  height: 100%;
  background-color: ${props => props.theme.colors.cardBg};
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  padding: 30px;
  overflow-y: auto;
  z-index: 1010;
  transition: right 0.3s ease-in-out;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const FilterTitle = styled.h3`
  font-size: ${props => props.theme.fontSizes.large};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 24px;
  cursor: pointer;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 25px;
`;

const FilterSectionTitle = styled.h4`
  font-size: ${props => props.theme.fontSizes.normal};
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
  font-weight: 500;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  input {
    margin-right: 5px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radius.small};
  background-color: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 10px;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  input {
    margin-right: 8px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.theme.colors.textSecondary};
    border-radius: 50%;
    outline: none;
    transition: all ${props => props.theme.transitions.short};
    position: relative;
    
    &:checked {
      border-color: ${props => props.theme.colors.primary};
      
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 30px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: ${props => props.theme.radius.medium};
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
`;

const ApplyButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const ResetButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.textSecondary};
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    border-color: ${props => props.theme.colors.text};
    color: ${props => props.theme.colors.text};
  }
`;

const GameFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    genre: '',
    platform: '',
    sort: 'popular'
  });

  // Загрузка жанров и платформ
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [genresResponse, platformsResponse] = await Promise.all([
          api.get('/games/genres/all'),
          api.get('/games/platforms/all')
        ]);
        setGenres(genresResponse.data);
        setPlatforms(platformsResponse.data);
      } catch (error) {
        console.error('Ошибка загрузки данных для фильтра:', error);
      }
    };

    fetchFilterData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    setFilters(prev => ({ ...prev, genre: e.target.value }));
  };

  const handlePlatformChange = (e) => {
    setFilters(prev => ({ ...prev, platform: e.target.value }));
  };

  const handleSortChange = (e) => {
    setFilters(prev => ({ ...prev, sort: e.target.value }));
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleResetFilter = () => {
    const resetFilters = {
      title: '',
      genre: '',
      platform: '',
      sort: 'popular'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
    
    // Prevent scrolling when filter is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
      <FilterButtonContainer>
        <FilterButton onClick={toggleFilter}>
          Фильтры
        </FilterButton>
      </FilterButtonContainer>

      <Overlay isOpen={isOpen} onClick={toggleFilter} />
      
      <FilterSidebar isOpen={isOpen}>
        <FilterHeader>
          <FilterTitle>Фильтры</FilterTitle>
          <CloseButton onClick={toggleFilter}>×</CloseButton>
        </FilterHeader>
        
        <FilterSection>
          <FilterSectionTitle>Поиск по названию</FilterSectionTitle>
          <SearchInput
            type="text"
            name="title"
            value={filters.title}
            onChange={handleInputChange}
            placeholder="Введите название игры..."
          />
        </FilterSection>
        
        <FilterSection>
          <FilterSectionTitle>Жанр</FilterSectionTitle>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="genre"
                value=""
                checked={filters.genre === ''}
                onChange={handleGenreChange}
              />
              Все жанры
            </RadioLabel>
            {genres.map(genre => (
              <RadioLabel key={genre.id}>
                <input
                  type="radio"
                  name="genre"
                  value={genre.name}
                  checked={filters.genre === genre.name}
                  onChange={handleGenreChange}
                />
                {genre.name}
              </RadioLabel>
            ))}
          </RadioGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterSectionTitle>Платформа</FilterSectionTitle>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="platform"
                value=""
                checked={filters.platform === ''}
                onChange={handlePlatformChange}
              />
              Все платформы
            </RadioLabel>
            {platforms.map(platform => (
              <RadioLabel key={platform.id}>
                <input
                  type="radio"
                  name="platform"
                  value={platform.name}
                  checked={filters.platform === platform.name}
                  onChange={handlePlatformChange}
                />
                {platform.name}
              </RadioLabel>
            ))}
          </RadioGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterSectionTitle>Сортировка</FilterSectionTitle>
          <RadioGroup>
            <RadioLabel>
              <input
                type="radio"
                name="sort"
                value="popular"
                checked={filters.sort === 'popular'}
                onChange={handleSortChange}
              />
              По популярности
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="sort"
                value="newest"
                checked={filters.sort === 'newest'}
                onChange={handleSortChange}
              />
              По новизне
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="sort"
                value="title_asc"
                checked={filters.sort === 'title_asc'}
                onChange={handleSortChange}
              />
              По названию (А-Я)
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="sort"
                value="title_desc"
                checked={filters.sort === 'title_desc'}
                onChange={handleSortChange}
              />
              По названию (Я-А)
            </RadioLabel>
          </RadioGroup>
        </FilterSection>
        
        <ButtonGroup>
          <ResetButton onClick={handleResetFilter}>
            Сбросить
          </ResetButton>
          <ApplyButton onClick={handleApplyFilter}>
            Применить
          </ApplyButton>
        </ButtonGroup>
      </FilterSidebar>
    </>
  );
};

export default GameFilter; 