import { useParams, Link } from 'react-router-dom';

function UserProfile() {
  // Получаем параметр userId из URL
  const { userId } = useParams();
  
  // В реальном приложении здесь был бы запрос к API
  // Сейчас используем mock данные
  const users = {
    1: { id: 1, name: 'Анна', role: 'Фронтенд разработчик', progress: 75 },
    2: { id: 2, name: 'Иван', role: 'Бэкенд разработчик', progress: 60 },
    3: { id: 3, name: 'Мария', role: 'Fullstack разработчик', progress: 85 }
  };

  const user = users[userId];

  // Если пользователь не найден
  if (!user) {
    return (
      <div className="page">
        <h1>Пользователь не найден</h1>
        <p>Пользователь с ID {userId} не существует.</p>
        <Link to="/">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="user-profile-header">
        <Link to="/" className="back-link">← Назад</Link>
        <h1>Профиль пользователя</h1>
      </div>
      
      <div className="user-profile-card">
        <div className="profile-avatar">
          <span className="avatar-text">{user.name.charAt(0)}</span>
        </div>
        
        <div className="profile-content">
          <h2>{user.name}</h2>
          <p className="profile-role">
            <span className="role-icon">💼</span>
            {user.role}
          </p>
          
          <div className="profile-progress">
            <div className="progress-header">
              <span className="progress-label">Прогресс изучения</span>
              <span className="progress-value">{user.progress}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <div 
                className="progress-bar-inner" 
                style={{ width: `${user.progress}%` }}
              >
                {user.progress >= 20 && (
                  <span className="progress-text">✓</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <span className="stat-label">Технологий изучено</span>
              <span className="stat-value">{Math.floor(user.progress / 10)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-label">Активных задач</span>
              <span className="stat-value">{Math.floor((100 - user.progress) / 15)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
