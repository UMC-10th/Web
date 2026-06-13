import { useState } from 'react';

export default function CounterWithState() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className="section-title">useState 사용</p>

      <div className="counter-display">{count}</div>

      <div className="btn-group">
        <button className="btn btn-danger" onClick={() => setCount(c => c - 1)}>
          − 감소
        </button>
        <button className="btn btn-secondary" onClick={() => setCount(0)}>
          초기화
        </button>
        <button className="btn btn-success" onClick={() => setCount(c => c + 1)}>
          + 증가
        </button>
      </div>

      <div className="info-box" style={{ marginTop: 24 }}>
        <h3>useState가 적합한 경우</h3>
        <ul>
          <li>상태가 단순한 숫자, 문자열, 불리언일 때</li>
          <li>상태 로직이 단순하고 독립적일 때</li>
          <li>다음 상태가 이전 상태와 관련 없을 때</li>
        </ul>
      </div>
    </div>
  );
}
