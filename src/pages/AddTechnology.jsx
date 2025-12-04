import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TechnologyForm from '../components/TechnologyForm';
import { useTechnologies } from '../contexts/TechnologiesContext';

function AddTechnology() {
  const navigate = useNavigate();

  const { addTechnology } = useTechnologies();

  // Обработчик сохранения технологии
  const handleSaveTechnology = async (techData) => {
    const newTechnology = {
      ...techData,
      notes: '',
      progress: 0
    };

    await addTechnology(newTechnology);
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
