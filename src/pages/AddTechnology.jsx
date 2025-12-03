import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnologyForm from '../components/TechnologyForm';

function AddTechnology() {
  const navigate = useNavigate();

  // Обработчик сохранения технологии
  const handleSaveTechnology = (techData) => {
    const saved = localStorage.getItem('technologies');
    const technologies = saved ? JSON.parse(saved) : [];

    // Создаем новую технологию с уникальным ID
    const newTechnology = {
      id: Date.now(),
      ...techData,
      status: 'not-started',
      createdAt: new Date().toISOString(),
      notes: '',
      progress: 0
    };

    // Добавляем в массив и сохраняем
    technologies.push(newTechnology);
    localStorage.setItem('technologies', JSON.stringify(technologies));

    // Перенаправляем на страницу со списком
    navigate('/technologies');
  };

  // Обработчик отмены
  const handleCancel = () => {
    navigate('/technologies');
  };

  return (
    <div className="page">
      <TechnologyForm
        onSave={handleSaveTechnology}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddTechnology;
