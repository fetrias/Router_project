import { useState, useEffect } from 'react';
import { useTechnologies } from '../contexts/TechnologiesContext';
import './BulkStatusEditor.css';

function BulkStatusEditor() {
  const { technologies = [], bulkUpdate } = useTechnologies();
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [message, setMessage] = useState('');

  const handleSelectAll = () => {
    if (selectedIds.length === technologies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(technologies.map(tech => tech.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleBulkUpdate = (e) => {
    e.preventDefault();

    if (selectedIds.length === 0) {
      setMessage('Выберите хотя бы одну технологию');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (!bulkStatus) {
      setMessage('Выберите статус для применения');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Применяем массовое обновление статуса через провайдер
    bulkUpdate(selectedIds, { status: bulkStatus });

    setMessage(`Статус обновлен для ${selectedIds.length} технологий`);
    setSelectedIds([]);
    setBulkStatus('');
    setTimeout(() => setMessage(''), 3000);
  };

  const statusOptions = [
    { value: 'not-started', label: 'Не начато', color: '#6c757d' },
    { value: 'in-progress', label: 'В процессе', color: '#007bff' },
    { value: 'completed', label: 'Завершено', color: '#28a745' },
    { value: 'on-hold', label: 'Приостановлено', color: '#ffc107' }
  ];

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.color : '#6c757d';
  };

  return (
    <div className="bulk-status-editor">
      <h3>Массовое редактирование статусов</h3>

      {technologies.length === 0 ? (
        <div className="empty-state">
          <p>Нет технологий для редактирования</p>
        </div>
      ) : (
        <>
          <div className="bulk-controls">
            <button
              type="button"
              onClick={handleSelectAll}
              className="btn-select-all"
            >
              {selectedIds.length === technologies.length ? 'Снять выделение' : 'Выбрать все'}
            </button>

            <div className="selection-info">
              Выбрано: <strong>{selectedIds.length}</strong> из {technologies.length}
            </div>
          </div>

          <div className="tech-list">
            {technologies.map(tech => (
              <label key={tech.id} className="tech-checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(tech.id)}
                  onChange={() => handleToggleSelect(tech.id)}
                />
                <div className="tech-info">
                  <div className="tech-name">{tech.title}</div>
                  <div
                    className="tech-status-badge"
                    style={{
                      backgroundColor: getStatusColor(tech.status) + '20',
                      color: getStatusColor(tech.status),
                      borderColor: getStatusColor(tech.status)
                    }}
                  >
                    {getStatusLabel(tech.status)}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <form onSubmit={handleBulkUpdate} className="bulk-form">
            <div className="form-group">
              <label htmlFor="bulkStatus">
                Новый статус <span className="required">*</span>
              </label>
              <select
                id="bulkStatus"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                required
              >
                <option value="">-- Выберите статус --</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-apply"
              disabled={selectedIds.length === 0 || !bulkStatus}
            >
              Применить к выбранным ({selectedIds.length})
            </button>
          </form>

          {message && (
            <div className={`message ${message.includes('обновлен') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BulkStatusEditor;
