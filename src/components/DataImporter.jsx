import { useState } from 'react';
import './DataImporter.css';

function DataImporter({ onImport }) {
  const [importError, setImportError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [importSuccess, setImportSuccess] = useState('');

  // Валидация импортируемых данных
  const validateImportData = (data) => {
    if (!data.technologies || !Array.isArray(data.technologies)) {
      throw new Error('Неверный формат файла: отсутствует массив technologies');
    }

    data.technologies.forEach((tech, index) => {
      if (!tech.title || !tech.description) {
        throw new Error(`Технология #${index + 1}: отсутствует название или описание`);
      }

      if (tech.title.length > 50) {
        throw new Error(`Технология "${tech.title}": название слишком длинное`);
      }
    });

    return true;
  };

  // Обработка загруженного файла
  const handleFileUpload = (file) => {
    setImportError('');
    setImportSuccess('');
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const importedData = JSON.parse(fileContent);
        
        validateImportData(importedData);
        
        if (onImport) {
          onImport(importedData.technologies);
          setImportSuccess(`✅ Успешно импортировано ${importedData.technologies.length} технологий!`);
        }
        
      } catch (error) {
        setImportError(`Ошибка импорта: ${error.message}`);
      }
    };

    reader.onerror = () => {
      setImportError('Ошибка чтения файла');
    };

    reader.readAsText(file);
  };

  // Обработчик выбора файла
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
      } else {
        setImportError('Поддерживаются только JSON файлы');
      }
    }
  };

  // Обработчики drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileUpload(file);
      } else {
        setImportError('Поддерживаются только JSON файлы');
      }
    }
  };

  return (
    <div className="data-importer">
      <h3>📤 Импорт дорожной карты</h3>

      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${importError ? 'error' : ''} ${importSuccess ? 'success' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-zone-content">
          <p className="drop-icon">📁</p>
          <p>Перетащите JSON файл сюда</p>
          <p className="or-text">или</p>
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelect}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="btn-select-file">
            Выберите файл
          </label>
        </div>
      </div>

      {importError && (
        <div className="import-error" role="alert">
          ❌ {importError}
        </div>
      )}

      {importSuccess && (
        <div className="import-success" role="status">
          {importSuccess}
        </div>
      )}

      <div className="import-help">
        <h4>Требования к файлу:</h4>
        <ul>
          <li>✅ Формат: JSON</li>
          <li>✅ Обязательные поля: title, description</li>
          <li>✅ Максимальная длина названия: 50 символов</li>
          <li>✅ Структура: <code>{`{"technologies": [...]}`}</code></li>
        </ul>
      </div>
    </div>
  );
}

export default DataImporter;
