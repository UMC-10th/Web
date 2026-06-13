import { useReducer } from 'react';

type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'INCREMENT_BY'; payload: number };

function counterReducer(state: number, action: CounterAction): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'RESET':
      return 0;
    case 'INCREMENT_BY':
      return state + action.payload;
    default:
      return state;
  }
}

export default function CounterWithReducer() {
  const [count, dispatch] = useReducer(counterReducer, 0);

  return (
    <div>
      <p className="section-title">useReducer 사용</p>

      <div className="counter-display">{count}</div>

      <div className="btn-group">
        <button className="btn btn-danger" onClick={() => dispatch({ type: 'DECREMENT' })}>
          − 감소
        </button>
        <button className="btn btn-secondary" onClick={() => dispatch({ type: 'RESET' })}>
          초기화
        </button>
        <button className="btn btn-success" onClick={() => dispatch({ type: 'INCREMENT' })}>
          + 증가
        </button>
      </div>

      <div className="btn-group" style={{ marginTop: 8 }}>
        <button className="btn btn-outline" onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 5 })}>
          +5 증가
        </button>
        <button className="btn btn-outline" onClick={() => dispatch({ type: 'INCREMENT_BY', payload: 10 })}>
          +10 증가
        </button>
      </div>

      <div className="info-box" style={{ marginTop: 24 }}>
        <h3>useReducer가 적합한 경우</h3>
        <ul>
          <li>여러 종류의 액션(action)이 존재할 때</li>
          <li>다음 상태가 이전 상태 값에 의존할 때</li>
          <li>복잡한 상태 로직을 분리하고 싶을 때</li>
          <li>상태 전환을 명확하게 표현하고 싶을 때</li>
        </ul>
      </div>
    </div>
  );
}
