import { useReducer, useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = 'all' | 'active' | 'completed';

type TodoState = {
  todos: Todo[];
  filter: Filter;
  nextId: number;
};

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: number }
  | { type: 'DELETE'; id: number }
  | { type: 'SET_FILTER'; filter: Filter };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos, { id: state.nextId, text: action.text, completed: false }],
        nextId: state.nextId + 1,
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      };
    case 'DELETE':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.id),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

const initialState: TodoState = {
  todos: [],
  filter: 'all',
  nextId: 1,
};

export default function TodoWithReducer() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState('');

  const { todos, filter } = state;

  const addTodo = () => {
    if (!input.trim()) return;
    dispatch({ type: 'ADD', text: input.trim() });
    setInput('');
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div>
      <p className="section-title">useReducer 1개 사용 (todos, filter, nextId 통합)</p>

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
            onClick={() => dispatch({ type: 'SET_FILTER', filter: f })}
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
              onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
            />
            <span className="todo-text">{todo.text}</span>
            <button
              className="todo-delete-btn"
              onClick={() => dispatch({ type: 'DELETE', id: todo.id })}
            >
              ✕
            </button>
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
