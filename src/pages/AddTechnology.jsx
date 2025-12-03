import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadmapImporter from '../components/RoadmapImporter';

function AddTechnology() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Получаем существующие технологии
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];

    // Создаем новую технологию с уникальным ID
    const newTechnology = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Добавляем в массив и сохраняем
    technologies.push(newTechnology);
    localStorage.setItem('technologies', JSON.stringify(technologies));

    // Перенаправляем на страницу со списком
    navigate('/technologies');
  };

  // Обработчик импорта из RoadmapImporter
  const handleImport = async (techData) => {
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];
    
    technologies.push(techData);
    localStorage.setItem('technologies', JSON.stringify(technologies));
  };

  return (
    <div className="page">
      <h1>Добавить новую технологию</h1>

      <RoadmapImporter onImport={handleImport} />

      <form onSubmit={handleSubmit} className="technology-form">
        <div className="form-group">
          <label htmlFor="title">Название технологии *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Например: React"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Краткое описание технологии"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Статус изучения</label>
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

        <div className="form-group">
          <label htmlFor="notes">Заметки (необязательно)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Ваши личные заметки о технологии"
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Добавить технологию
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/technologies')}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnology;
