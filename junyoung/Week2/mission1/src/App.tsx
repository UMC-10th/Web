import { useState, useRef } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>('');
  const nextId = useRef<number>(1);

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;

    setTodos((prev) => [...prev, { id: nextId.current, text, completed: false }]);
    nextId.current += 1;
    setInput('');
  };

  const handleComplete = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const handleDelete = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleAdd();
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const doneTodos = todos.filter((t) => t.completed);

  return (
    <div className="todo-app">
      <h1 className="todo-app__title">YONG TODO</h1>

      <div className="todo-app__input-area">
        <input
          className="todo-app__input"
          type="text"
          placeholder="할 일 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="todo-app__add-btn" onClick={handleAdd}>
          할 일 추가
        </button>
      </div>

      <div className="todo-app__section">
        <div className="todo-app__column">
          <h2 className="todo-app__column-title">할 일</h2>
          <ul className="todo-app__list">
            {activeTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <span className="todo-item__text">{todo.text}</span>
                <button
                  className="todo-item__btn"
                  onClick={() => handleComplete(todo.id)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="todo-app__column">
          <h2 className="todo-app__column-title">완료</h2>
          <ul className="todo-app__list">
            {doneTodos.map((todo) => (
              <li key={todo.id} className="todo-item todo-item--done">
                <span className="todo-item__text">{todo.text}</span>
                <button
                  className="todo-item__btn todo-item__btn--delete"
                  onClick={() => handleDelete(todo.id)}
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
