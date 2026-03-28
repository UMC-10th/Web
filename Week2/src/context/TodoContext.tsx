import type { TTodo } from '../types/todo';
import {
    createContext,
    useContext,
    useState,
    type PropsWithChildren,
    type ReactElement,
} from 'react';

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteDoneTodo: (id: number) => void;
}

export const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({ children }: PropsWithChildren): ReactElement => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string): void => {
        const newTodo: TTodo = { id: Date.now(), text };
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDone) => [...prevDone, todo]);
    };

    const deleteDoneTodo = (id: number): void => {
        setDoneTodos((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <TodoContext.Provider
            value={{ todos, doneTodos, addTodo, completeTodo, deleteDoneTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = (): ITodoContext => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo를 사용하기 위해서는 무조건 TodoProvider로 감싸져야 합니다.');
    }

    return context;
};
