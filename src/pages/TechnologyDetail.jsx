import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';

function TechnologyDetail() {
  const { techId } = useParams();
  const navigate = useNavigate();
  const [technology, setTechnology] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const tech = technologies.find(t => t.id === parseInt(techId));
      setTechnology(tech);
    }
  }, [techId]);

  const updateStatus = (newStatus) => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.map(tech =>
        tech.id === parseInt(techId) ? { ...tech, status: newStatus } : tech
      );
      localStorage.setItem('technologies', JSON.stringify(updated));
      setTechnology({ ...technology, status: newStatus });
    }
  };

  const deleteTechnology = () => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      const technologies = JSON.parse(saved);
      const updated = technologies.filter(tech => tech.id !== parseInt(techId));
      localStorage.setItem('technologies', JSON.stringify(updated));
      setShowDeleteModal(false);
      navigate('/technologies');
    }
  };

  const loadAdditionalResources = async () => {
    try {
      setLoadingResources(true);
      setResourcesError(null);
      
      const query = technology.title.toLowerCase().replace(/\s+/g, '-');
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}+in:topics&sort=stars&per_page=5`
      );
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить ресурсы');
      }
      
      const data = await response.json();
      
      const newResources = data.items.map(item => ({
        id: item.id,
        title: item.name,
        description: item.description || 'Без описания',
        url: item.html_url,
        stars: item.stargazers_count,
        language: item.language
      }));
      
      setResources(newResources);
      
    } catch (err) {
      setResourcesError(err.message);
    } finally {
      setLoadingResources(false);
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <h1>Технология не найдена</h1>
        <p>Технология с ID {techId} не существует.</p>
        <Link to="/technologies" className="btn">
           Назад к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/technologies" className="back-link">
           Назад к списку
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
          <h3> Дополнительные ресурсы</h3>
          
          {!resources.length && !loadingResources && !resourcesError && (
            <button 
              onClick={loadAdditionalResources}
              className="btn"
            >
               Загрузить рекомендуемые ресурсы
            </button>
          )}

          {loadingResources && (
            <div className="loading-resources">
              <p> Загрузка ресурсов из GitHub...</p>
            </div>
          )}

          {resourcesError && (
            <div className="resources-error">
              <p> Ошибка: {resourcesError}</p>
              <button onClick={loadAdditionalResources} className="btn">
                Попробовать снова
              </button>
            </div>
          )}

          {resources.length > 0 && (
            <div className="resources-list">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-header">
                    <h4>{resource.title}</h4>
                    <span className="resource-stars"> {resource.stars}</span>
                  </div>
                  <p className="resource-description">{resource.description}</p>
                  {resource.language && (
                    <span className="resource-language">
                       {resource.language}
                    </span>
                  )}
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="resource-link"
                  >
                    Открыть на GitHub 
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="detail-section">
          <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger">
            Удалить технологию
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteTechnology}
        title="Удаление технологии"
        message={`Вы уверены, что хотите удалить технологию "${technology.title}"? Это действие нельзя отменить.`}
      />
    </div>
  );
}

export default TechnologyDetail;
