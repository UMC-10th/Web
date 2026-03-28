import type { ReactElement } from 'react';
import { useTodo } from '../context/TodoContext';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const Todo = (): ReactElement => {
    const { todos, doneTodos, completeTodo, deleteDoneTodo } = useTodo();

    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>MIRO TODO</h1>
            <TodoForm />
            <div className='render-container'>
                <TodoList
                    title='할 일'
                    todos={todos}
                    buttonLabel='완료'
                    buttonColor='#28a745'
                    onClick={completeTodo}
                />
                <TodoList
                    title='완료'
                    todos={doneTodos}
                    buttonLabel='삭제'
                    buttonColor='#dc3545'
                    onClick={(todo) => deleteDoneTodo(todo.id)}
                />
            </div>
        </div>
    );
};

export default Todo;
