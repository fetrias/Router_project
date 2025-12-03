import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  // Пример данных пользователей
  const users = [
    { id: 1, name: 'Анна' },
    { id: 2, name: 'Иван' },
    { id: 3, name: 'Мария' }
  ];

  // Состояние для отслеживания авторизации
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);

  // Проверяем авторизацию при загрузке и при изменении
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUsersDropdown && !event.target.closest('.dropdown')) {
        setShowUsersDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUsersDropdown]);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="app">
        {/* Навигационное меню */}
        <nav className="main-nav">
          <div className="nav-brand">
            <h2>🚀 Трекер технологий</h2>
          </div>
          <ul className="nav-links">
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/about">О проекте</Link></li>
            <li><Link to="/contact">Контакты</Link></li>
            <li><Link to="/technologies">Все технологии</Link></li>
            <li><Link to="/statistics">Статистика</Link></li>
            <li><Link to="/settings">Настройки</Link></li>
            
            <li className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => setShowUsersDropdown(!showUsersDropdown)}
              >
                Пользователи {showUsersDropdown ? '▲' : '▼'}
              </button>
              {showUsersDropdown && (
                <ul className="dropdown-menu">
                  {users.map(user => (
                    <li key={user.id}>
                      <Link 
                        to={`/user/${user.id}`}
                        onClick={() => setShowUsersDropdown(false)}
                      >
                        {user.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            
            {isLoggedIn ? (
              <>
                <li><Link to="/dashboard">Панель управления</Link></li>
                <li className="user-info">
                  <span>Привет, {username}!</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Выйти
                  </button>
                </li>
              </>
            ) : (
              <li><Link to="/login">Войти</Link></li>
            )}
          </ul>
        </nav>

        {/* Основное содержимое */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Динамический маршрут для пользователей */}
            <Route path="/user/:userId" element={<UserProfile />} />
            
            {/* Маршруты для технологий */}
            <Route path="/technologies" element={<TechnologyList />} />
            <Route path="/technology/:techId" element={<TechnologyDetail />} />
            <Route path="/add-technology" element={<AddTechnology />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Авторизация и защищенные маршруты */}
            <Route 
              path="/login" 
              element={<Login onLogin={handleLogin} />} 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
