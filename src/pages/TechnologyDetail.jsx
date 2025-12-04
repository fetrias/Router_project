import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTechnologies } from '../contexts/TechnologiesContext';
import ConfirmModal from '../components/ConfirmModal';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { technologies, updateTechnology, deleteTechnology } = useTechnologies();

  useEffect(() => {
    if (technologies && technologies.length > 0) {
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech || null);
    }
  }, [techId, technologies]);

  const updateStatus = (newStatus) => {
    if (!technology) return;
    updateTechnology(technology.id, { status: newStatus });
    setTechnology({ ...technology, status: newStatus });
  };

  const handleDelete = () => {
    if (!technology) return;
    deleteTechnology(technology.id);
    setShowDeleteModal(false);
    navigate('/technologies');
  };


  if (!technology) {
    return (
      <div className="page">
          <h1>Технология не найдена</h1>
          <p>Технология с ID {techId} не существует.</p>
          <Link to="/technologies" className="btn">
            ← Назад к списку
          </Link>
        </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
          ← Назад к списку
        </Link>
        <h1>{technology.title}</h1>
      </div>

      <div className="technology-detail">
        <div className="detail-section">
          <h3>Описание</h3>
          <p>{technology.description}</p>
        </div>

        <div className="detail-section">
          <h3>Статус изучения</h3>
          <div className="status-buttons">
            <button
              onClick={() => updateStatus('not-started')}
              className={technology.status === 'not-started' ? 'active' : ''}
              >
              Не начато
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              className={technology.status === 'in-progress' ? 'active' : ''}
              >
              В процессе
            </button>
            <button
              onClick={() => updateStatus('completed')}
              className={technology.status === 'completed' ? 'active' : ''}
              >
              Завершено
            </button>
          </div>
        </div>

        {technology.notes && (
          <div className="detail-section">
            <h3>Мои заметки</h3>
            <p>{technology.notes}</p>
          </div>
        )}

        <div className="detail-section">
          <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">
            Удалить технологию
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Подтвердить удаление"
        message={`Вы уверены, что хотите удалить технологию "${technology.title}"? Это действие нельзя отменить.`}
      />
    </div>
  );
}

export default TechnologyDetail;
