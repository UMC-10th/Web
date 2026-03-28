// ===================================================
// 🍠 단계 2: 컴포넌트 분리 - TodoItem 컴포넌트
//
// [props-drilling 발생 지점]
// App.tsx → TodoList → TodoItem 으로
// onComplete / onDelete 함수가 계속 props로 전달됨
// TodoList 자체는 이 함수들을 직접 사용하지 않음에도
// 단지 TodoItem에 전달하기 위해 받아야 함 → props-drilling
// ===================================================

type Todo = {
  id: number;
  text: string;
};

type TodoItemProps = {
  todo: Todo;
  isDone: boolean;
  // ⚠️ props-drilling: App.tsx의 함수가 TodoList를 거쳐 여기까지 전달됨
  onComplete: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

function TodoItem({ todo, isDone, onComplete, onDelete }: TodoItemProps) {
  return (
    <li className="render-container__item">
      <span className="render-container__item-text">{todo.text}</span>
      {isDone ? (
        <button
          className="render-container__item-button render-container__item-button--delete"
          onClick={() => onDelete(todo)}
        >
          삭제
        </button>
      ) : (
        <button
          className="render-container__item-button render-container__item-button--complete"
          onClick={() => onComplete(todo)}
        >
          완료
        </button>
      )}
    </li>
  );
}

export default TodoItem;
export type { Todo };
