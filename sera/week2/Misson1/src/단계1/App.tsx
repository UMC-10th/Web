// ===================================================
//  단계 1: App.tsx 하나의 파일에서 구현
// - useState로 할 일 추가 / 완료 / 삭제 기능 구현
// - 모든 UI와 로직이 App 컴포넌트 안에 존재
// ===================================================

import { useState } from "react";
import "../App.css";

// Todo 타입 정의
type Todo = {
  id: number;
  text: string;
};

function App() {
  // 할 일 목록 상태
  const [todos, setTodos] = useState<Todo[]>([]);
  // 완료 목록 상태
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);
  // 입력창 상태
  const [inputValue, setInputValue] = useState("");

  // 할 일 추가
  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text }]);
    setInputValue("");
  };
 
  // 할 일 → 완료 이동
  const completeTask = (todo: Todo) => {
    setTodos(todos.filter((t) => t.id !== todo.id));
    setDoneTasks([...doneTasks, todo]);
  };

  // 완료 항목 삭제
  const deleteTask = (todo: Todo) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">SERA TODO</h1>

      {/* 입력 폼 */}
      <form
        className="todo-container__form"
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일을 입력해주세요."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="todo-container__button">
          할일추가
        </button>
      </form>

      {/* 할 일 / 완료 목록 */}
      <div className="render-container">
        {/* 할 일 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <ul className="render-container__list">
            {todos.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button render-container__item-button--complete"
                  onClick={() => completeTask(todo)}
                >
                  완료
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 완료 섹션 */}
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <ul className="render-container__list">
            {doneTasks.map((todo) => (
              <li key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button render-container__item-button--delete"
                  onClick={() => deleteTask(todo)}
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
