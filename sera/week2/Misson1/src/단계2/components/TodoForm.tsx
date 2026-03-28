// ===================================================
// 🍠 단계 2: 컴포넌트 분리 - TodoForm 컴포넌트 (props 버전)
// ===================================================

type TodoFormProps = {
  onAdd: (text: string) => void;
};

function TodoForm({ onAdd }: TodoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("todo") as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;
    onAdd(text);
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

export default TodoForm;
