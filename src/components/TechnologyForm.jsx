import { useState, useEffect, useRef } from 'react';
import './TechnologyForm.css';

function TechnologyForm({ onSave, onCancel, initialData = {} }) {
  // Состояние формы
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'not-started'
  });

  // Состояние ошибок
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const statusRef = useRef(null);

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Валидация названия
    if (!formData.title.trim()) {
      newErrors.title = 'Название технологии обязательно';
    } else if (formData.title.trim().length < 2) {
      newErrors.title = 'Название должно содержать минимум 2 символа';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'Название не должно превышать 50 символов';
    }

    // Валидация описания
    if (!formData.description.trim()) {
      newErrors.description = 'Описание технологии обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Описание должно содержать минимум 10 символов';
    }

    // (Остальные поля не требуются по заданию и не валидируются здесь)

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  // Валидация при каждом изменении формы
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid) {
      onSave(formData);

      if (statusRef.current) {
        statusRef.current.textContent = 'Форма успешно отправлена';
      }
    } else {
      // Фокус на первое поле с ошибкой
      const firstError = Object.keys(errors)[0];
      if (firstError === 'title' && titleRef.current) {
        titleRef.current.focus();
      } else if (firstError === 'description' && descriptionRef.current) {
        descriptionRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="technology-form" noValidate>
      <h2>{initialData.title ? 'Редактирование технологии' : 'Добавление новой технологии'}</h2>

      {/* Поле названия */}
      <div className="form-group">
        <label htmlFor="title" className="required">
          Название технологии
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          ref={titleRef}
          className={errors.title ? 'error' : ''}
          placeholder="Например: React, Node.js, TypeScript"
          aria-describedby={errors.title ? 'title-error' : undefined}
          required
        />
        {errors.title && (
          <span id="title-error" className="error-message" role="alert">
            {errors.title}
          </span>
        )}
      </div>

      {/* Поле описания */}
      <div className="form-group">
        <label htmlFor="description" className="required">
          Описание
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          ref={descriptionRef}
          rows="4"
          className={errors.description ? 'error' : ''}
          placeholder="Опишите, что это за технология и зачем её изучать..."
          aria-describedby={errors.description ? 'description-error' : undefined}
          required
        />
        {errors.description && (
          <span id="description-error" className="error-message" role="alert">
            {errors.description}
          </span>
        )}
      </div>

      {/* Поле статуса */}
      <div className="form-group">
        <label htmlFor="status">
          Статус изучения
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="not-started">Не начато</option>
          <option value="in-progress">В процессе</option>
          <option value="completed">Завершено</option>
        </select>
      </div>

      {/* Кнопки формы */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary"
        >
          {initialData.title ? 'Обновить технологию' : 'Добавить технологию'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Отмена
        </button>
      </div>

      {/* Информация о валидности формы */}
      {!isFormValid && (
        <div className="form-validation-info" role="status">
          ⚠️ Заполните все обязательные поля корректно
        </div>
      )}
      {/* aria-live region for screen readers */}
      <div
        ref={statusRef}
        aria-live="polite"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }}
      />
    </form>
  );
}

export default TechnologyForm;
