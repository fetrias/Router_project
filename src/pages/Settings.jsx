import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import DataExporter from '../components/DataExporter';
import DataImporter from '../components/DataImporter';

function Settings() {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    notifications: localStorage.getItem('notifications') === 'true',
    autoSave: localStorage.getItem('autoSave') !== 'false'
  });

  // Загрузка технологий при старте
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      try {
        setTechnologies(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading technologies:', error);
      }
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    localStorage.setItem(key, value.toString());
  };

  const clearAllData = () => {
    localStorage.removeItem('technologies');
    setShowClearModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // Обработчик импорта для DataImporter
  const handleImport = (importedTechnologies) => {
    const existing = localStorage.getItem('technologies');
    const current = existing ? JSON.parse(existing) : [];
    
    // Фильтруем дубликаты по ID
    const newTech = importedTechnologies.filter(newItem => 
      !current.some(existingItem => existingItem.id === newItem.id)
    );
    
    const updated = [...current, ...newTech];
    localStorage.setItem('technologies', JSON.stringify(updated));
    setTechnologies(updated);
  };

  return (
    <div className="page">
      <h1>⚙️ Настройки приложения</h1>

      <div className="settings-sections">
        <div className="settings-section">
          <h2>Внешний вид</h2>
          <div className="setting-item">
            <label>
              <span>Тема оформления</span>
              <select 
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
                <option value="auto">Автоматически</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Уведомления</h2>
          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              />
              <span>Включить уведомления</span>
            </label>
            <p className="setting-description">
              Получать напоминания о необходимости изучения технологий
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Сохранение данных</h2>
          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              />
              <span>Автоматическое сохранение</span>
            </label>
            <p className="setting-description">
              Автоматически сохранять изменения в localStorage
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Управление данными</h2>
          
          <div className="setting-item">
            <DataExporter technologies={technologies} />
          </div>

          <div className="setting-item">
            <DataImporter onImport={handleImport} />
          </div>

          <div className="setting-item danger-zone">
            <h3>Опасная зона</h3>
            <p className="setting-description">
              Удалить все данные из приложения безвозвратно
            </p>
            <button onClick={() => setShowClearModal(true)} className="btn btn-danger">
              🗑️ Удалить все данные
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>О приложении</h2>
          <div className="about-app">
            <p><strong>Версия:</strong> 1.0.0</p>
            <p><strong>React:</strong> 19.2.0</p>
            <p><strong>React Router:</strong> 7.9.6</p>
            <p><strong>Создано для:</strong> Практическое занятие 23</p>
          </div>
        </div>
      </div>

      {/* Сообщение об успешном удалении */}
      {showSuccessMessage && (
        <div className="success-toast">
          ✅ Все данные успешно удалены!
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearAllData}
        title="Удаление всех данных"
        message="Вы уверены, что хотите удалить все технологии? Это действие нельзя отменить."
      />
    </div>
  );
}

export default Settings;
