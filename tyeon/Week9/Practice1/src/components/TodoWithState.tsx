import { useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

export default function TodoWithState() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [nextId, setNextId] = useState(1);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos(prev => [...prev, { id: nextId, text: input.trim(), completed: false }]);
    setNextId(id => id + 1);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div>
      <p className="section-title">useState 4개 사용 (todos, input, filter, nextId)</p>

      <div className="todo-input-row">
        <input
          className="todo-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일을 입력하세요..."
        />
        <button className="btn btn-primary" onClick={addTodo}>추가</button>
      </div>

      <div className="filter-row">
        {(['all', 'active', 'completed'] as Filter[]).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '전체' : f === 'active' ? '진행중' : '완료'}
          </button>
        ))}
      </div>

      <p className="todo-count">
        총 {todos.length}개 · 완료 {todos.filter(t => t.completed).length}개
      </p>

      <ul className="todo-list">
        {filtered.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <button className="todo-delete-btn" onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ textAlign: 'center', color: '#bbb', padding: '20px', fontSize: '0.9rem' }}>
            할 일이 없습니다
          </li>
        )}
      </ul>
    </div>
  );
}
