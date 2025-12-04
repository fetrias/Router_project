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
      console.log('[useTechnologiesApi] Saved data from localStorage:', saved);

      if (saved) {
        // Попробуем выполнить мягкую миграцию: если в сохранённых данных есть
        // старые поля (category, difficulty, deadline, resources) — создаём резервную
        // копию и удаляем эти поля из записей.
        try {
          const parsed = JSON.parse(saved);

          const hasOldFields = parsed.some(item => (
            item && (item.hasOwnProperty('category') || item.hasOwnProperty('difficulty') || item.hasOwnProperty('deadline') || item.hasOwnProperty('resources'))
          ));

          if (hasOldFields) {
            // Создаём резервную копию с временной меткой
            try {
              const backupKey = `technologies_backup_${Date.now()}`;
              localStorage.setItem(backupKey, JSON.stringify(parsed));
              console.info(`[useTechnologiesApi] Backup saved to localStorage key: ${backupKey}`);
            } catch (bkErr) {
              console.warn('[useTechnologiesApi] Failed to write backup to localStorage', bkErr);
            }

            // Убираем старые поля
            const cleaned = parsed.map(({ category, difficulty, deadline, resources, ...rest }) => rest);
            localStorage.setItem('technologies', JSON.stringify(cleaned));
            setTechnologies(cleaned);
          } else {
            setTechnologies(parsed);
          }
        } catch (parseErr) {
          console.error('[useTechnologiesApi] Failed to parse saved technologies, falling back to empty', parseErr);
          setTechnologies([]);
        }
      } else {
        // Mock данные если ничего нет
        console.log('[useTechnologiesApi] No saved data, creating default technologies');
        const mockTechnologies = [
          {
            id: 1,
            title: 'React',
            description: 'Библиотека для создания пользовательских интерфейсов',
            status: 'in-progress'
          },
          {
            id: 2,
            title: 'Node.js',
            description: 'Среда выполнения JavaScript на сервере',
            status: 'not-started'
          },
          {
            id: 3,
            title: 'TypeScript',
            description: 'Типизированное надмножество JavaScript',
            status: 'completed'
          }
        ];
        
        console.log('[useTechnologiesApi] Setting default technologies:', mockTechnologies);
        setTechnologies(mockTechnologies);
        localStorage.setItem('technologies', JSON.stringify(mockTechnologies));
        console.log('[useTechnologiesApi] Default technologies saved to localStorage');
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
        id: techData.id || Date.now(),
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

  // Массовое обновление (например, смена статусов)
  const bulkUpdate = async (ids = [], updates = {}) => {
    try {
      const updatedTechs = technologies.map(tech =>
        ids.includes(tech.id) ? { ...tech, ...updates } : tech
      );

      setTechnologies(updatedTechs);
      localStorage.setItem('technologies', JSON.stringify(updatedTechs));
    } catch (err) {
      throw new Error('Не удалось выполнить массовое обновление');
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
    ,bulkUpdate
  };
}

export default useTechnologiesApi;
