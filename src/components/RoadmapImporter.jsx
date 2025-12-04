import { useState } from 'react';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport }) {
  const [importing, setImporting] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  // Пример импорта из публичного API
  const handleImportFromAPI = async () => {
    try {
      setImporting(true);
      
      // Используем публичное API для демонстрации
      // В реальном приложении здесь будет roadmap.sh API или другой источник
      const response = await fetch('https://api.github.com/repos/kamranahmedse/developer-roadmap/contents/public/roadmaps');
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить дорожную карту');
      }
      
      const data = await response.json();
      
      // Создаем технологии из полученных данных
      const newTechs = data.slice(0, 5).map((item, index) => ({
        id: Date.now() + index,
        title: item.name.replace('.json', '').replace(/-/g, ' '),
        description: `Дорожная карта для ${item.name}`,
        status: 'not-started',
        createdAt: new Date().toISOString()
      }));
      
      // Вызываем колбэк для добавления технологий (передаём массив)
      if (onImport) {
        // Если onImport возвращает промис, ждём его
        const res = onImport(newTechs);
        if (res && res.then) await res;
      }

      alert(`Успешно импортировано ${newTechs.length} технологий из дорожных карт!`);
      
    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
      console.error('Ошибка импорта:', err);
    } finally {
      setImporting(false);
    }
  };

  // Импорт из пользовательского URL
  const handleImportFromURL = async (e) => {
    e.preventDefault();
    
    if (!importUrl.trim()) {
      alert('Введите URL для импорта');
      return;
    }

    try {
      setImporting(true);
      
      const response = await fetch(importUrl);
      if (!response.ok) {
        throw new Error('Не удалось загрузить данные по URL');
      }
      
      const data = await response.json();
      
      // Предполагаем, что данные содержат массив technologies
      if (data.technologies && Array.isArray(data.technologies)) {
        for (const tech of data.technologies) {
          if (onImport) {
            await onImport({
              ...tech,
              id: Date.now() + Math.random(),
              createdAt: new Date().toISOString()
            });
          }
        }
        alert(`Импортировано ${data.technologies.length} технологий!`);
      } else {
        throw new Error('Неверный формат данных');
      }
      
      setImportUrl('');
      
    } catch (err) {
      alert(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="roadmap-importer">
      <h3>📥 Импорт дорожной карты</h3>
      
      <div className="import-section">
        <p>Загрузите технологии из внешних источников</p>
        
        <div className="import-actions">
          <button 
            onClick={handleImportFromAPI}
            disabled={importing}
            className="import-button"
          >
            {importing ? '⌛ Импорт...' : '🗺️ Импорт из GitHub Roadmaps'}
          </button>
        </div>

        <div className="url-import">
          <form onSubmit={handleImportFromURL}>
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="Или введите URL для импорта JSON..."
              className="url-input"
              disabled={importing}
            />
            <button 
              type="submit" 
              disabled={importing || !importUrl.trim()}
              className="url-import-btn"
            >
              Импорт
            </button>
          </form>
          <p className="hint">Формат: {`{"technologies": [...]}`}</p>
        </div>
      </div>
    </div>
  );
}

export default RoadmapImporter;
