import { useState, useEffect } from 'react';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка технологий из localStorage или API
  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем из localStorage
      const saved = localStorage.getItem('technologies');
      
      if (saved) {
        setTechnologies(JSON.parse(saved));
      } else {
        // Mock данные если ничего нет
        const mockTechnologies = [
          {
            id: 1,
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            category: 'frontend',
            difficulty: 'beginner',
            status: 'in-progress',
            resources: ['https://react.dev', 'https://ru.reactjs.org']
          },
          {
            id: 2,
            title: 'Node.js',
            description: 'Среда выполнения JavaScript на сервере',
            category: 'backend',
            difficulty: 'intermediate',
            status: 'not-started',
            resources: ['https://nodejs.org']
          },
          {
            id: 3,
            title: 'TypeScript',
            description: 'Типизированное надмножество JavaScript',
            category: 'language',
            difficulty: 'intermediate',
            status: 'completed',
            resources: ['https://www.typescriptlang.org']
          }
        ];
        
        setTechnologies(mockTechnologies);
        localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
      }
      
    } catch (err) {
      setError('Не удалось загрузить технологии');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Добавление новой технологии
  const addTechnology = async (techData) => {
    try {
      const newTech = {
        id: Date.now(),
        ...techData,
        createdAt: new Date().toISOString()
      };
      
      const updatedTechs = [...technologies, newTech];
      setTechnologies(updatedTechs);
      localStorage.setItem('technologies', JSON.stringify(updatedTechs));
      
      return newTech;
      
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  // Обновление технологии
  const updateTechnology = async (id, updates) => {
    try {
      const updatedTechs = technologies.map(tech =>
        tech.id === id ? { ...tech, ...updates } : tech
      );
      
      setTechnologies(updatedTechs);
      localStorage.setItem('technologies', JSON.stringify(updatedTechs));
      
    } catch (err) {
      throw new Error('Не удалось обновить технологию');
    }
  };

  // Удаление технологии
  const deleteTechnology = async (id) => {
    try {
      const updatedTechs = technologies.filter(tech => tech.id !== id);
      setTechnologies(updatedTechs);
      localStorage.setItem('technologies', JSON.stringify(updatedTechs));
      
    } catch (err) {
      throw new Error('Не удалось удалить технологию');
    }
  };

  // Загружаем технологии при монтировании
  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    updateTechnology,
    deleteTechnology
  };
}

export default useTechnologiesApi;
