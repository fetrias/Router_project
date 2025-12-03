import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TechnologySearch.css';

function TechnologySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const debounceTimeout = useRef(null);

  // Функция поиска
  const searchTechnologies = (searchQuery) => {
    setSearching(true);
    
    // Получаем технологии из localStorage
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    // Фильтруем по запросу
    const filtered = technologies.filter(tech => 
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Имитируем задержку сети
    setTimeout(() => {
      setResults(filtered);
      setSearching(false);
      setShowResults(true);
    }, 300);
  };

  // Обработчик изменения с debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Очищаем предыдущий таймер
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Если пустой запрос - сбрасываем результаты
    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      setSearching(false);
      return;
    }

    // Устанавливаем новый таймер (500мс задержка)
    setSearching(true);
    debounceTimeout.current = setTimeout(() => {
      searchTechnologies(value);
    }, 500);
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#2d6a4f';
      case 'in-progress': return '#52b788';
      case 'not-started': return '#95d5b2';
      default: return '#ccc';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      case 'not-started': return 'Не начато';
      default: return status;
    }
  };

  return (
    <div className="technology-search-page">
      <h1>🔍 Поиск технологий</h1>
      
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Введите название технологии, описание или категорию..."
            className="search-input"
          />
          {searching && <div className="search-spinner">⌛</div>}
        </div>

        {query && (
          <p className="search-hint">
            Поиск с задержкой 500мс...
          </p>
        )}
      </div>

      {showResults && (
        <div className="search-results">
          <h2>
            {results.length > 0 
              ? `Найдено результатов: ${results.length}` 
              : 'Ничего не найдено'}
          </h2>

          {results.length > 0 && (
            <div className="results-grid">
              {results.map((tech) => (
                <Link 
                  to={`/technologies/${tech.id}`} 
                  key={tech.id}
                  className="result-card"
                >
                  <div className="result-header">
                    <h3>{tech.title}</h3>
                    <span 
                      className="result-status"
                      style={{ backgroundColor: getStatusColor(tech.status) }}
                    >
                      {getStatusText(tech.status)}
                    </span>
                  </div>
                  <p className="result-description">{tech.description}</p>
                  <div className="result-meta">
                    <span className="result-category">📁 {tech.category}</span>
                    <span className="result-difficulty">
                      {tech.difficulty === 'beginner' && '🟢 Начальный'}
                      {tech.difficulty === 'intermediate' && '🟡 Средний'}
                      {tech.difficulty === 'advanced' && '🔴 Продвинутый'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {results.length === 0 && (
            <div className="no-results">
              <p>🤷‍♂️ По запросу "{query}" ничего не найдено</p>
              <p>Попробуйте другой поисковый запрос</p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="search-empty">
          <p>💡 Начните вводить для поиска технологий</p>
          <p>Поиск работает по названию, описанию и категории</p>
        </div>
      )}
    </div>
  );
}

export default TechnologySearch;
