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
      <Link to="/" className="back-link">← Назад</Link>
      <h1>Профиль пользователя</h1>
      
      <div className="user-profile-card">
        <div className="profile-avatar">
          {user.name.charAt(0)}
        </div>
        
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-role">{user.role}</p>
        
        <div className="profile-progress">
          <div className="progress-info">
            <span>Прогресс изучения</span>
            <strong>{user.progress}%</strong>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${user.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
