// ===================================================
// 🍠 단계 3: Context API로 전역 상태 관리
//
// TodoContext가 제공하는 것:
// - todos: 할 일 목록
// - doneTasks: 완료 목록
// - addTodo: 할 일 추가
// - completeTask: 완료 처리
// - deleteTask: 삭제
//
// 어떻게 props-drilling을 해결했나?
// 기존: App → TodoList → TodoItem 으로 함수를 props 체인으로 전달
// 개선: 각 컴포넌트가 useTodo()로 필요한 값을 직접 가져옴
//       TodoList는 더 이상 onComplete / onDelete를 전달받지 않아도 됨
// ===================================================

import { createContext, useContext, useState } from "react";

type Todo = {
  id: number;
  text: string;
};

type TodoContextType = {
  todos: Todo[];
  doneTasks: Todo[];
  addTodo: (text: string) => void;
  completeTask: (todo: Todo) => void;
  deleteTask: (todo: Todo) => void;
};

// Context 생성 (초기값은 null, 사용 시 useTodo()로만 접근)
const TodoContext = createContext<TodoContextType | null>(null);

// Provider: 상태와 함수를 자식 전체에 공급
function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTasks, setDoneTasks] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text }]);
  };

  const completeTask = (todo: Todo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTasks((prev) => [...prev, todo]);
  };

  const deleteTask = (todo: Todo) => {
    setDoneTasks((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <TodoContext.Provider value={{ todos, doneTasks, addTodo, completeTask, deleteTask }}>
      {children}
    </TodoContext.Provider>
  );
}

// 커스텀 훅: Context를 편리하게 사용
function useTodo() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodo는 TodoProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}

export { TodoProvider, useTodo };
export type { Todo };
