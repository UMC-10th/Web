import { useState, type ReactElement } from 'react';
import type { TTodo } from '../types/todo';

const TodoBefore = (): ReactElement => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const[doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
        e.preventDefault();
        const text = input.trim();

        if(text){
            const newTodo: TTodo = {
                id: Date.now(),
                text
            };
            setTodos((prevTodos) : TTodo[] => [...prevTodos, newTodo]);
            setInput('');
        }
    };
    
    const completeTodo = (todo: TTodo): void => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setDoneTodos((prevDone) => [...prevDone, todo]);
    };

    const deleteDoneTodo = (id: number): void => {
        setDoneTodos((prev) => prev.filter((t) => t.id !== id));
    };


    return (
        <div className='todo-container'>
            <h1 className='todo-container__header'>MIRO TODO</h1>
            <form onSubmit={handleSubmit} className='todo-container__form'>
                <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className='todo-container__input' 
                placeholder='할 일 입력'
                required
                />
                <button type='submit' className='todo-container__button'>
                    할 일 추가
                </button>
            </form>
            <div className='render-container'>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>할 일</h2>
                    <ul id='todo-list' className='render-container__list'>
                    {todos.map((todo) => (
                        <li className='render-container__item' key={todo.id}>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button
                                type='button'
                                onClick={() => completeTodo(todo)}
                                style={{
                                    backgroundColor: '#28a745',
                                }}
                                className='render-container__item-button'>
                                완료
                            </button>
                        </li>
                    ))}
                    </ul>
                </div>
                <div className='render-container__section'>
                    <h2 className='render-container__title'>완료</h2>
                    <ul id='todo-list' className='render-container__list'>
                    {doneTodos.map((todo) => (
                        <li className='render-container__item' key={todo.id}>
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button
                                type='button'
                                onClick={() => deleteDoneTodo(todo.id)}
                                style={{
                                    backgroundColor: '#dc3545',
                                }}
                                className='render-container__item-button'>
                                삭제
                            </button>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TodoBefore