import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import DataExporter from '../components/DataExporter';
import DataImporter from '../components/DataImporter';
import { useTechnologies } from '../contexts/TechnologiesContext';

function Settings() {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { technologies, addTechnology, refetch } = useTechnologies();
  const [localTechnologies, setLocalTechnologies] = useState([]);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light'
  });

  // Синхронизируем локальное отображение с провайдером
  useEffect(() => {
    setLocalTechnologies(technologies || []);
  }, [technologies]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    localStorage.setItem(key, value.toString());
  };

  const clearAllData = () => {
    // Удаляем все технологии через localStorage и предлагаем рефреш провайдера
    localStorage.removeItem('technologies');
    setShowClearModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      // Попытаемся обновить провайдер
      refetch();
      window.location.reload();
    }, 800);
  };

  // Обработчик импорта для DataImporter
  const handleImport = async (importedTechnologies) => {
    // Поддерживаем как массив, так и одиночный объект
    let items = [];
    if (!importedTechnologies) return;
    if (Array.isArray(importedTechnologies)) {
      items = importedTechnologies;
    } else if (typeof importedTechnologies === 'object') {
      items = [importedTechnologies];
    } else {
      return;
    }

    // Добавляем каждую технологию через провайдер, избегая дубликатов
    const existing = technologies || [];
    const newItems = items.filter(it => !existing.some(e => e.id === it.id));
    for (const it of newItems) {
      // ensure id and createdAt
      const tech = {
        id: it.id || Date.now() + Math.random(),
        ...it,
        createdAt: it.createdAt || new Date().toISOString()
      };
      await addTechnology(tech);
    }
    // Обновим локальный вид
    setLocalTechnologies(technologies || []);
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
