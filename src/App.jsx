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
import UserList from './pages/UserList';
import ProductSearch from './pages/ProductSearch';
import PostList from './pages/PostList';
import TechnologySearch from './pages/TechnologySearch';
import ProtectedRoute from './components/ProtectedRoute';
import AppMui from './AppMui';
import './App.css';
import { TechnologiesProvider } from './contexts/TechnologiesContext';

function App() {
  const users = [
    { id: 1, name: 'Анна' },
    { id: 2, name: 'Иван' },
    { id: 3, name: 'Мария' }
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsersDropdown, setShowUsersDropdown] = useState(false);

  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'light';
      if (theme === 'dark') {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    };

    applyTheme();

    window.addEventListener('themeChange', applyTheme);
    window.addEventListener('storage', applyTheme);

    return () => {
      window.removeEventListener('themeChange', applyTheme);
      window.removeEventListener('storage', applyTheme);
    };
  }, []);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = localStorage.getItem('username') || '';
    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, []);

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
    <Router basename={import.meta.env.BASE_URL}>
      <TechnologiesProvider>
        <div className="app">
          <nav className="main-nav">
            <div className="nav-brand">
              <h2>Трекер технологий</h2>
            </div>
            <ul className="nav-links">
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/about">О проекте</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
              <li><Link to="/technologies">Все технологии</Link></li>
              <li><Link to="/technology-search">Поиск</Link></li>
              <li><Link to="/api-examples">API Примеры</Link></li>
              <li><Link to="/statistics">Статистика</Link></li>
              <li><Link to="/settings">Настройки</Link></li>
              <li><Link to="/mui">Material-UI</Link></li>

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
              <Route path="/technology-search" element={<TechnologySearch />} />

              {/* Маршруты для API примеров */}
              <Route path="/api-examples" element={<UserList />} />
              <Route path="/product-search" element={<ProductSearch />} />
              <Route path="/posts" element={<PostList />} />

              {/* Material-UI версия приложения */}
              <Route path="/mui" element={<AppMui />} />

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
      </TechnologiesProvider>
    </Router>
  );
}

export default App;
