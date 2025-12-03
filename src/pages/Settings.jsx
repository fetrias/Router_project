import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

function Settings() {
  const [showClearModal, setShowClearModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    notifications: localStorage.getItem('notifications') === 'true',
    autoSave: localStorage.getItem('autoSave') !== 'false'
  });

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

  const exportData = () => {
    const technologies = localStorage.getItem('technologies');
    if (!technologies) {
      alert('Нет данных для экспорта');
      return;
    }

    const dataStr = JSON.stringify(JSON.parse(technologies), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `technologies-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        localStorage.setItem('technologies', JSON.stringify(data));
        alert('Данные успешно импортированы!');
        window.location.reload();
      } catch (error) {
        alert('Ошибка при импорте данных. Проверьте формат файла.');
      }
    };
    reader.readAsText(file);
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
            <h3>Экспорт данных</h3>
            <p className="setting-description">
              Скачать резервную копию всех ваших технологий
            </p>
            <button onClick={exportData} className="btn btn-primary">
              📥 Экспортировать данные
            </button>
          </div>

          <div className="setting-item">
            <h3>Импорт данных</h3>
            <p className="setting-description">
              Загрузить данные из файла резервной копии
            </p>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file" className="btn btn-secondary">
              📤 Импортировать данные
            </label>
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
