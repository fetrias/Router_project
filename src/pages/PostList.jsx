import useApi from '../hooks/useApi';
import './PostList.css';

function PostList() {
  // Используем наш кастомный хук
  const { data: posts, loading, error, refetch } = useApi(
    'https://jsonplaceholder.typicode.com/posts'
  );

  if (loading) {
    return (
      <div className="post-list loading">
        <div className="spinner"></div>
        <p>Загрузка постов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-list error">
        <h2>Ошибка при загрузке постов</h2>
        <p>{error}</p>
        <button onClick={refetch} className="retry-button">Попробовать снова</button>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h2>Список постов ({posts?.length || 0})</h2>
        <button onClick={refetch} className="refresh-button">
          🔄 Обновить
        </button>
      </div>

      <div className="posts-container">
        {posts?.map(post => (
          <article key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div className="post-meta">
              <span>ID: {post.id}</span>
              <span>User: {post.userId}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default PostList;
