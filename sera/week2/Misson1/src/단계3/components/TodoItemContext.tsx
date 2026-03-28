// ===================================================
// 🍠 단계 3: Context 버전 TodoItem
//
// [props-drilling 해결]
// 이전: onComplete, onDelete를 props로 받아야 했음
//       (App → TodoList → TodoItem 체인)
// 이후: useTodo()로 직접 함수를 가져옴
//       TodoList에서 아무것도 전달받지 않아도 됨
// ===================================================

import { useTodo, type Todo } from "../context/TodoContext";

type TodoItemContextProps = {
  todo: Todo;
  isDone: boolean;
};

function TodoItemContext({ todo, isDone }: TodoItemContextProps) {
  // props-drilling 해결: Context에서 직접 가져옴
  const { completeTask, deleteTask } = useTodo();

  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      {isDone ? (
        <button
          className="render-container__item-button render-container__item-button--delete"
          onClick={() => deleteTask(todo)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button render-container__item-button--complete"
          onClick={() => completeTask(todo)}
        >
          완료
        </button>
      )}
    </li>
  );
}

export default TodoItemContext;
