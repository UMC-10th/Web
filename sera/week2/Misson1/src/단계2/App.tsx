// ===================================================
// 🍠 단계 2: 컴포넌트 분리 버전 (props-drilling 발생)
//
// 분리된 컴포넌트:
// - TodoForm: 입력 UI
// - TodoList: 목록 렌더링
// - TodoItem: 개별 항목
//
// [props-drilling 문제]
// completeTask, deleteTask 함수가
// App → TodoList → TodoItem 순으로 전달됨
// TodoList는 이 함수를 직접 사용하지 않는데도
// props로 받아서 다시 TodoItem에 내려줘야 함
// 컴포넌트 depth가 깊어질수록 이 문제가 심해짐
// ===================================================

import { useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import type { Todo } from "./components/TodoItem";
import "../App.css";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };

  const completeTask = (todo: Todo) => {
    setTodos(todos.filter((t) => t.id !== todo.id));
    setDoneTasks([...doneTasks, todo]);
  };

  const deleteTask = (todo: Todo) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">SERA TODO</h1>

      {/* TodoForm: onAdd만 전달 (props-drilling 없음) */}
      <TodoForm onAdd={addTodo} />

      <div className="render-container">
        {/* ⚠️ props-drilling 발생:
            App의 completeTask / deleteTask가
            TodoList → TodoItem 까지 전달되어야 함
            TodoList는 이 함수들을 직접 쓰지 않음 */}
        <TodoList
          title="할 일"
          todos={todos}
          isDone={false}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
        <TodoList
          title="완료"
          todos={doneTasks}
          isDone={true}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}

export default App;
