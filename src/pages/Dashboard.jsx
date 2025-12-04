import { useTechnologies } from '../contexts/TechnologiesContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { technologies = [] } = useTechnologies();

  // Подсчёт статистики
  const totalTechnologies = technologies.length;
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;
  const notStartedCount = technologies.filter(t => t.status === 'not-started').length;

  return (
    <div className="page">
      <h1>Панель управления</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>📊 Статистика</h3>
          <p>Всего технологий: {totalTechnologies}</p>
          <p>Завершено: {completedCount}</p>
          <p>В процессе: {inProgressCount}</p>
          <p>Не начато: {notStartedCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>🎯 Быстрые действия</h3>
          <Link to="/add-technology" className="btn btn-primary">
            + Добавить технологию
          </Link>
          <Link to="/technologies" className="btn">
            Все технологии
          </Link>
        </div>

        <div className="dashboard-card">
          <h3>⚙️ Управление</h3>
          <Link to="/settings" className="btn">
            Настройки
          </Link>
          <Link to="/statistics" className="btn">
            Подробная статистика
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
