/*
======================================================
        <Week 2 Mission 1: Todo List 만들기>
     [1 단계]: TodoBefore 하나의 파일에서 기능 구현
======================================================
- useState를 이용하여 할 일 리스트와 입력값 관리
- 할 일 추가, 완료, 삭제 기능 구현
- 아직 완료되지 않은 일과 완료된 일을 isDone 속성으로 구분하여 렌더링
======================================================
*/

import { useState } from 'react';
import '../App.css';

// 할 일 객체 type 정의
type Work = {
  id: number;
  text: string;
  isDone: boolean;
}

// 버튼 색상
const COMP_BTN_COLOR = "rgb(27, 88, 255)";
const DELETE_BTN_COLOR = "rgb(255, 0, 0)";

function TodoBefore() {
  // 할 일 리스트 및 입력값(할일 제목) state 정의
  const [works, setWorks] = useState<Work[]>([]);
  const [input, setInput] = useState<string>("");

  // onChange event 발생 시 입력값 업데이트 함수
  const getInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 할 일 추가 함수 (할 일 추가 버튼 클릭 시)
  const addWork = (e: React.FormEvent<HTMLButtonElement>) => {
    // 기본 폼 제출 이벤트 방지
    e.preventDefault();

    // 입력값이 공백인 경우 할 일 추가하지 않음, trim()은 앞, 뒤 공백 제거한 string return
    if (input.trim() === "")
      return;

    // 새로운 할 일 객체 생성
    const newWork: Work = {
      id: Date.now(),
      text: input,
      isDone: false
    };

    // 새로운 할 일을 기존 할 일 리스트의 맨 앞에 추가 후 state 업데이트
    setWorks(prev => [newWork, ...prev]);
  }

  // 할 일 완료 함수 (완료 버튼 클릭 시)
  const doneWork = (id:number) => {
    // 완료 처리할 할 일 객체를 id로 탐색하여 완료 처리 후 state 업데이트
    setWorks(prev => prev.map(work => 
      work.id === id ? { ...work, isDone: true } : work
    ));
  }

  // 할 일 삭제 함수 (삭제 버튼 클릭 시)
  const deleteWork = (id: number) => {
    // 삭제 처리할 할 일 객체를 id로 탐색하여 삭제 후(필터링) state 업데이트
    setWorks(prev => prev.filter(work => work.id !== id));
  }

  return (
    <>
     <div className="todo-container">
        <h1 className="todo-container__title">TYEON TODO</h1>
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
        <div className="render-container">
            <div className="render-container__list">
                <h2 className="render-container__subtitle">할 일</h2>
                <ul className="render-container__works" id="notyet-works">
                  {/* 아직 완료되지 않은 일들만 */}
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
            <div className="render-container__list">
                <h2 className="render-container__subtitle">완료</h2>
                <ul className="render-container__works" id="done-works">
                  {/* 완료된 일들만 */}
                  {works.filter(work => work.isDone).map(
                    work => (
                      <li key={work.id} className="render-container__work">
                        <span className="render-container__work-text">{work.text}</span>
                        <button 
                          className="render-container__work-button"
                          onClick={() => deleteWork(work.id)} 
                          style={{ backgroundColor: DELETE_BTN_COLOR }}>
                            삭제
                        </button>
                      </li>)
                    )}
                </ul>
            </div>
        </div>
    </div>
    </>
  )
}

export default TodoBefore;
