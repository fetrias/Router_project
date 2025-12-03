import { useState, useEffect } from 'react';
import './DeadlineForm.css';

function DeadlineForm() {
  const [technologies, setTechnologies] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const [deadline, setDeadline] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  // Загрузка технологий при старте
  useEffect(() => {
    loadTechnologies();
  }, []);

  const loadTechnologies = () => {
    const stored = localStorage.getItem('technologies');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTechnologies(parsed);
      } catch (error) {
        console.error('Error loading technologies:', error);
      }
    }
  };

  // Валидация дедлайна
  useEffect(() => {
    const newErrors = {};
    
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 5);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Дедлайн не может быть в прошлом';
      } else if (deadlineDate > maxDate) {
        newErrors.deadline = 'Дедлайн не может быть более чем через 5 лет';
      }
    }
    
    setErrors(newErrors);
  }, [deadline]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTech) {
      setMessage('Выберите технологию');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (!deadline) {
      setMessage('Укажите дедлайн');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (Object.keys(errors).length > 0) {
      setMessage('Исправьте ошибки в форме');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Обновляем технологию с дедлайном
    const updated = technologies.map(tech => 
      tech.id === parseInt(selectedTech) 
        ? { ...tech, deadline }
        : tech
    );
    
    setTechnologies(updated);
    localStorage.setItem('technologies', JSON.stringify(updated));
    
    setMessage('Дедлайн установлен успешно!');
    setSelectedTech('');
    setDeadline('');
    
    setTimeout(() => setMessage(''), 3000);
  };

  // Получение минимальной даты (сегодня)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Получение максимальной даты (+5 лет)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="deadline-form">
      <h3>Установка сроков изучения</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="technology">
            Технология <span className="required">*</span>
          </label>
          <select
            id="technology"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            required
          >
            <option value="">-- Выберите технологию --</option>
            {technologies.map(tech => (
              <option key={tech.id} value={tech.id}>
                {tech.title} {tech.deadline && `(дедлайн: ${new Date(tech.deadline).toLocaleDateString()})`}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="deadline">
            Планируемая дата освоения <span className="required">*</span>
          </label>
          <input
            id="deadline"
            name="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            className={errors.deadline ? 'error' : ''}
            aria-describedby={errors.deadline ? 'deadline-error' : undefined}
            required
          />
          {errors.deadline && (
            <span id="deadline-error" className="error-message" role="alert">
              {errors.deadline}
            </span>
          )}
          <span className="help-text">
            Дата должна быть от сегодня до {getMaxDate()}
          </span>
        </div>

        <button 
          type="submit" 
          disabled={!selectedTech || !deadline || Object.keys(errors).length > 0}
          className="btn-primary"
        >
          Установить дедлайн
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default DeadlineForm;
