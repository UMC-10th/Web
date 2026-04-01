// ===================================================
// 🍠 단계 2: 컴포넌트 분리 - TodoList 컴포넌트
//
// [props-drilling 발생 지점]
// TodoList는 onComplete / onDelete를 직접 사용하지 않음
// 오직 TodoItem에 넘겨주기 위해 props로 받아야 함
// → 이것이 props-drilling 문제!
//
// 예: App → TodoList(전달만 함) → TodoItem(실제 사용)
// ===================================================

import TodoItem, { type Todo } from "./TodoItem";

type TodoListProps = {
  todos: Todo[];
  isDone: boolean;
  title: string;
  // ⚠️ props-drilling: TodoList는 이 두 함수를 사용하지 않음
  //    TodoItem에 전달하기 위해서만 받는 것
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

function TodoList({ todos, isDone, title, onComplete, onDelete }: TodoListProps) {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {todos.map((todo) => (
          // ⚠️ props-drilling: App에서 받은 함수를 그대로 TodoItem으로 전달
          <TodoItem
            key={todo.id}
            todo={todo}
            isDone={isDone}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
