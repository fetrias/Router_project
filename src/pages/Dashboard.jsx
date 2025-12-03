function Dashboard() {
  return (
    <div className="page">
      <h1>Панель управления</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>📊 Статистика</h3>
          <p>Всего технологий: 0</p>
          <p>Изучено: 0</p>
          <p>В процессе: 0</p>
        </div>
        
        <div className="dashboard-card">
          <h3>🎯 Недавняя активность</h3>
          <p>Пока нет активности</p>
        </div>
        
        <div className="dashboard-card">
          <h3>⚙️ Настройки</h3>
          <p>Управление вашим профилем и технологиями</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
