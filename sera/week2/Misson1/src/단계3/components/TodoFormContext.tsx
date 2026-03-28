// ===================================================
// 🍠 단계 3: Context 버전 TodoForm
// props 없이 useTodo()로 직접 addTodo 사용
// ===================================================

import { useTodo } from "../context/TodoContext";

function TodoFormContext() {
  const { addTodo } = useTodo(); // Context에서 직접 가져옴, props 불필요

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("todo") as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;
    addTodo(text);
    input.value = "";
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="todo"
        className="todo-container__input"
        placeholder="할 일을 입력해주세요."
      />
      <button type="submit" className="todo-container__button">
        할일추가
      </button>
    </form>
  );
}

export default TodoFormContext;
