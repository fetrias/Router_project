import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DeadlineForm from '../components/DeadlineForm';
import BulkStatusEditor from '../components/BulkStatusEditor';

function TechnologyList() {
  const [technologies, setTechnologies] = useState([]);

  // Загружаем технологии из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('technologies');
    if (saved) {
      setTechnologies(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Все технологии</h1>
        <Link to="/add-technology" className="btn btn-primary">
          + Добавить технологию
        </Link>
      </div>

      <div className="technologies-grid">
        {technologies.map(tech => (
          <div key={tech.id} className="technology-item">
            <h3>{tech.title}</h3>
            <p>{tech.description}</p>
            <div className="technology-meta">
              <span className={`status status-${tech.status}`}>
                {tech.status === 'not-started' && 'Не начато'}
                {tech.status === 'in-progress' && 'В процессе'}
                {tech.status === 'completed' && 'Завершено'}
              </span>
              <Link to={`/technology/${tech.id}`} className="btn-link">
                Подробнее →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {technologies.length === 0 && (
        <div className="empty-state">
          <p>Технологий пока нет.</p>
          <Link to="/add-technology" className="btn btn-primary">
            Добавить первую технологию
          </Link>
        </div>
      )}

      {/* Practice 25: Задания 1 и 2 */}
      {technologies.length > 0 && (
        <>
          <DeadlineForm />
          <BulkStatusEditor />
        </>
      )}
    </div>
  );
}

export default TechnologyList;
