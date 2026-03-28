// ===================================================
// 🍠 단계 3: Context 버전 TodoList
//
// [props-drilling 해결]
// 이전: onComplete, onDelete를 props로 받아서 TodoItem에 전달
//       (사용도 안 하면서 전달만 하는 문제)
// 이후: todos / isDone / title 만 받으면 됨
//       함수는 TodoItemContext 내부에서 useTodo()로 직접 사용
// ===================================================

import { useTodo } from "../context/TodoContext";
import TodoItemContext from "./TodoItemContext";

type TodoListContextProps = {
  title: string;
  isDone: boolean;
};

function TodoListContext({ title, isDone }: TodoListContextProps) {
  // 직접 todos / doneTasks 가져옴 (props로 받지 않아도 됨)
  const { todos, doneTasks } = useTodo();
  const list = isDone ? doneTasks : todos;

  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {list.map((todo) => (
          // onComplete / onDelete props가 사라짐
          <TodoItemContext key={todo.id} todo={todo} isDone={isDone} />
        ))}
      </ul>
    </div>
  );
}

export default TodoListContext;
