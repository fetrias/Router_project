import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTechnologies } from '../contexts/TechnologiesContext';

function Statistics() {
  const [stats, setStats] = useState({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0
  });

  const { technologies = [] } = useTechnologies();

  useEffect(() => {
    const statistics = {
      total: technologies.length,
      notStarted: technologies.filter(t => t.status === 'not-started').length,
      inProgress: technologies.filter(t => t.status === 'in-progress').length,
      completed: technologies.filter(t => t.status === 'completed').length
    };
    setStats(statistics);
  }, [technologies]);

  const completionPercentage = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const inProgressPercentage = stats.total > 0
    ? Math.round((stats.inProgress / stats.total) * 100)
    : 0;

  const notStartedPercentage = stats.total > 0
    ? Math.round((stats.notStarted / stats.total) * 100)
    : 0;

  return (
    <div className="page">
      <h1>📊 Статистика изучения технологий</h1>

      {stats.total === 0 ? (
        <div className="empty-state">
          <p>Пока нет данных для статистики.</p>
          <Link to="/add-technology" className="btn btn-primary">
            Добавить первую технологию
          </Link>
        </div>
      ) : (
        <>
          <div className="stats-overview">
            <div className="stat-card">
              <h3>Всего технологий</h3>
              <div className="stat-number">{stats.total}</div>
            </div>

            <div className="stat-card stat-completed">
              <h3>Завершено</h3>
              <div className="stat-number">{stats.completed}</div>
              <div className="stat-percentage">{completionPercentage}%</div>
            </div>

            <div className="stat-card stat-in-progress">
              <h3>В процессе</h3>
              <div className="stat-number">{stats.inProgress}</div>
              <div className="stat-percentage">{inProgressPercentage}%</div>
            </div>

            <div className="stat-card stat-not-started">
              <h3>Не начато</h3>
              <div className="stat-number">{stats.notStarted}</div>
              <div className="stat-percentage">{notStartedPercentage}%</div>
            </div>
          </div>

          <div className="progress-section">
            <h2>График прогресса</h2>

            {/* Круговая диаграмма */}
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="pie-svg">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#d4edda"
                  strokeWidth="40"
                  strokeDasharray={`${completionPercentage * 5.03} ${500 - completionPercentage * 5.03}`}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#fff3cd"
                  strokeWidth="40"
                  strokeDasharray={`${inProgressPercentage * 5.03} ${500 - inProgressPercentage * 5.03}`}
                  strokeDashoffset={-completionPercentage * 5.03}
                  transform="rotate(-90 100 100)"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="40"
                  strokeDasharray={`${notStartedPercentage * 5.03} ${500 - notStartedPercentage * 5.03}`}
                  strokeDashoffset={-(completionPercentage + inProgressPercentage) * 5.03}
                  transform="rotate(-90 100 100)"
                />
                <text x="100" y="105" textAnchor="middle" className="pie-text">
                  {completionPercentage}%
                </text>
              </svg>
            </div>

            {/* Легенда */}
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color legend-completed"></span>
                <span>Завершено ({stats.completed})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-in-progress"></span>
                <span>В процессе ({stats.inProgress})</span>
              </div>
              <div className="legend-item">
                <span className="legend-color legend-not-started"></span>
                <span>Не начато ({stats.notStarted})</span>
              </div>
            </div>

            {/* Линейный прогресс-бар */}
            <div className="linear-progress">
              <h3>Общий прогресс изучения</h3>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill completed"
                    style={{ width: `${completionPercentage}%` }}
                  >
                    {completionPercentage > 5 && `${completionPercentage}%`}
                  </div>
                  <div
                    className="progress-bar-fill in-progress"
                    style={{ width: `${inProgressPercentage}%` }}
                  >
                    {inProgressPercentage > 5 && `${inProgressPercentage}%`}
                  </div>
                  <div
                    className="progress-bar-fill not-started"
                    style={{ width: `${notStartedPercentage}%` }}
                  >
                    {notStartedPercentage > 5 && `${notStartedPercentage}%`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-actions">
            <Link to="/technologies" className="btn btn-primary">
              Посмотреть все технологии
            </Link>
            <Link to="/add-technology" className="btn btn-secondary">
              Добавить технологию
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Statistics;
