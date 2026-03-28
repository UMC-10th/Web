/*
==============================================================================================
                            <Week 2 Mission 1: Todo List 만들기>
            [2, 3 단계]: component 분리 및 Context API 활용 ~ props_drilling 해결
==============================================================================================
1. component 분리
    i) InputForm: 할 일 입력 및 추가 기능
    [변경 전]
    <form className="todo-container__form" id="todo-form">
            <input  id="todo-input"
                    className="todo-container__input" 
                    type="text" 
                    placeholder="할 일 입력..."
                    onChange={getInput}
                    value={input}
            />
            <button 
              className="todo-container__button" 
              id="add-button"
              onClick={addWork}>
                할 일 추가
              </button>
    </form>

    [변경 후]
    <InputForm input={input} setInput={setInput} addWork={addWork} />
    - input, setInput, addWork을 InputForm의 props로 전달하여, InputForm에서 할 일 입력 및 추가 기능 구현
    - input을 이용해 일을 추가해야했기 때문에, input과 setInput을 함께 전달해야 했음

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ii) WorkContainer: 할 일 리스트 렌더링 및 완료/삭제 기능
    [변경 전]
    <div className="render-container__list">
        <h2 className="render-container__subtitle">할 일</h2>
        <ul className="render-container__works" id="notyet-works">
            {works.filter(work => !work.isDone).map(
                work => (
                    <li key={work.id} className="render-container__work">
                    <span className="render-container__work-text">{work.text}</span>
                    <button 
                        className='render-container__work-button'
                        onClick={() => doneWork(work.id)} 
                        style={{ backgroundColor: COMP_BTN_COLOR }}>
                            완료
                        </button>
                    </li>)
            )}
        </ul>
    </div>

    [변경 후]
    <WorkContainer 
        works={works.filter(work => !work.isDone 또는 work.isDone)} 
        onClick={doneWork 또는 deleteWork} 
        isDone={false 또는 true}
    />
    - works를 WorkContainer의 props로 전달하여, WorkContainer에서 할 일 리스트 렌더링
        - 이때 filter 함수를 이용하여, 아직 완료된 일들과 완료되지 않은 일들을 구분하여 전달, 
          즉 WorkContainer를 2개로 분리하여 각각 완료된 일들과 완료되지 않은 일들을 렌더링
    
    - onClick을 WorkContainer의 props로 전달하여, WorkContainer에서 버튼 클릭 시
      doneWork 또는 deleteWork 실행

    - works, doneWork, deleteWork을 WorkContainer의 props로 전달하여,
      WorkContainer에서 할 일 리스트 렌더링 및 완료 기능 구현

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

2. Context API 활용 ~ props_drilling 해결
    - Todo 컴포넌트에서 WorkContext의 works, addWork, doneWork, deleteWork을 
      useWork 커스텀 훅으로 가져와서 사용

    - InputForm 컴포넌트에서는 addWork 함수만 필요하기 때문에, useWork 커스텀 훅으로 addWork 함수만 가져와서 사용

    - WorkContainer 컴포넌트에서는 works 리스트와 onClick 함수(doneWork 또는 deleteWork)가 필요하기 때문에, 
      useWork 커스텀 훅으로 works 리스트와 onClick 함수(doneWork 또는 deleteWork)를 가져와서 사용

    - 이렇게 처리하면, Todo 컴포넌트에서 InputForm과 WorkContainer로 props를 전달할 필요 없이, 
      각 컴포넌트에서 useWork 커스텀 훅으로 필요한 값과 함수를 가져와서 사용할 수 있기 때문에
      props_drilling 문제 해결

==============================================================================================
*/


import InputForm from './InputForm';
import WorkContainer from './WorkContainer';
import { useWork } from '../context/WorkContext';
import '../App.css';

function Todo() {
    const { works, doneWork, deleteWork } = useWork(); // 이렇게 처리하면 무조건 context가 존재하기 때문에, context?.로 optional chaining 처리할 필요 없음

    return (
    <>
        <div className="todo-container">
            <h1 className="todo-container__title">TYEON TODO</h1>
            <InputForm />
            <div className="render-container">
                {/* 아직 완료되지 않은 일들만 ~ update function: doneWork */}
                <WorkContainer 
                    works={works.filter(work => !work.isDone)} 
                    onClick={doneWork} 
                    isDone={false}
                />

                {/* 완료된 일들만 ~ update function: deleteWork */}
                <WorkContainer 
                    works={works.filter(work => work.isDone)} 
                    onClick={deleteWork} 
                    isDone={true}
                />
            </div>
        </div>
    </>
    );
}

export default Todo;