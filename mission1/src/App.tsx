import { useState } from 'react'
import './App.css'
import { useTheme } from './ContextPage'

type Task = {
  id: number;
  text: string;
};

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = { id: Date.now(), text: inputValue };
    setTodos([...todos, newTask]);
    setInputValue('');
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (id: number) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== id));
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-10 transition-colors duration-500 ${isDarkMode ? 'dark bg-zinc-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <button onClick={toggleTheme} className="mb-8 px-4 py-2 rounded-lg bg-amber-400 dark:bg-indigo-600 text-white font-bold shadow-md">
        {isDarkMode ? '라이트 모드' : '다크 모드'}
      </button>
      <div className={`todo-container ${isDarkMode ? 'dark-mode-card' : ''}`}>
        <h1 className="todo-container__header">CORN TODO</h1>
        <form className="todo-container__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo-container__input"
            placeholder="할 일 입력"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
          <button type="submit" className="todo-container__button">할 일 추가</button>
        </form>
        <div className="render-container">
          <div className="render-container__section">
            <h2 className="render-container__title">할 일</h2>
            <ul className="render-container__list">
              {todos.map((task) => (
                <li key={task.id} className="render-container__item">
                  <span className="render-container__item-text">{task.text}</span>
                  <button 
                    onClick={() => completeTask(task)} 
                    className="render-container__item-button" 
                    style={{backgroundColor: '#28a745'}}
                  >완료</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="render-container__section">
            <h2 className="render-container__title">완료</h2>
            <ul className="render-container__list">
              {doneTasks.map((task) => (
                <li key={task.id} className="render-container__item">
                  <span className="render-container__item-text">{task.text}</span>
                  <button 
                    onClick={() => deleteTask(task.id)} 
                    className="render-container__item-button"
                  >삭제</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App