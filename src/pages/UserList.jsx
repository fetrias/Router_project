import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserList.css';

function UserList() {
  // Состояния для данных, загрузки и ошибок
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функция для загрузки пользователей
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Выполняем GET-запрос к API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      // Проверяем успешность ответа
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      // Парсим JSON-ответ
      const userData = await response.json();
      setUsers(userData);
      
    } catch (err) {
      // Обрабатываем ошибки
      setError(err.message);
      console.error('Ошибка при загрузке пользователей:', err);
    } finally {
      // Выключаем индикатор загрузки в любом случае
      setLoading(false);
    }
  };

  // Выполняем запрос при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для повторной загрузки
  const handleRetry = () => {
    fetchUsers();
  };

  // Показываем индикатор загрузки
  if (loading) {
    return (
      <div className="user-list loading">
        <div className="spinner"></div>
        <p>Загрузка пользователей...</p>
      </div>
    );
  }

  // Показываем сообщение об ошибке
  if (error) {
    return (
      <div className="user-list error">
        <h2>Произошла ошибка</h2>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  // Отображаем список пользователей
  return (
    <div className="user-list">
      <h1>📡 API Примеры</h1>
      
      <div className="api-navigation">
        <Link to="/product-search" className="api-nav-card">
          <h3>🔍 Поиск продуктов</h3>
          <p>Поиск с debounce и AbortController</p>
        </Link>
        <Link to="/posts" className="api-nav-card">
          <h3>📝 Посты</h3>
          <p>Использование кастомного хука useApi</p>
        </Link>
      </div>

      <h2>👥 Список пользователей ({users.length})</h2>
      <p className="example-description">
        Загрузка данных с внешнего API, обработка состояний загрузки и ошибок
      </p>
      
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Телефон:</strong> {user.phone}</p>
            <p><strong>Город:</strong> {user.address.city}</p>
            <p><strong>Компания:</strong> {user.company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
