import { useState } from 'react';
import { useWork } from '../context/WorkContext';

function InputForm() {
    // 할 일 리스트 및 입력값(할일 제목) state 정의
    const [input, setInput] = useState<string>("");
    const { addWork } = useWork();

    const submitInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addWork(input); // context의 addWork 함수로 할 일 추가
        setInput(""); // 입력값 초기화
    }

    return (
        <>
            <form className="todo-container__form" id="todo-form" onSubmit={submitInput}>
                <input  id="todo-input"
                        className="todo-container__input" 
                        type="text" 
                        placeholder="할 일 입력..."
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                />
                <button 
                className="todo-container__button" 
                id="add-button"
                type="submit">
                    할 일 추가
                </button>
            </form>
        </>
    )
}

export default InputForm;