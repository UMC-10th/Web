// ===================================================
// 🍠 단계 3: Context API 최종 버전
//
// App.tsx는 이제 레이아웃만 담당
// 상태와 함수는 TodoProvider가 전역으로 관리
// 각 컴포넌트는 필요한 것만 useTodo()로 직접 꺼냄
//
// [props-drilling 해결 정리]
// 문제: App → TodoList → TodoItem 으로 함수를 전달
//       TodoList는 함수를 직접 쓰지 않음에도 props로 받아야 했음
//
// 해결: TodoProvider로 Context 공급
//       TodoItemContext가 useTodo()로 직접 completeTask/deleteTask 사용
//       TodoListContext는 onComplete/onDelete props가 필요 없어짐
//       App.tsx에서 함수를 props로 내려줄 필요 없어짐
// ===================================================

import { TodoProvider } from "./context/TodoContext";
import TodoFormContext from "./components/TodoFormContext";
import TodoListContext from "./components/TodoListContext";
import "../App.css";

function App() {
  return (
    // Provider로 전체 앱을 감쌈 → 하위 어디서든 useTodo() 사용 가능
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">SERA TODO</h1>

        {/* props 없이 사용 가능 */}
        <TodoFormContext />

        <div className="render-container">
          {/* title, isDone 만 전달 - 함수 props 없음 */}
          <TodoListContext title="할 일" isDone={false} />
          <TodoListContext title="완료" isDone={true} />
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
