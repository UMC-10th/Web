export default function Summary() {
  return (
    <div className="summary-section">
      <h2>useState vs useReducer 비교 정리</h2>

      <table className="summary-table">
        <thead>
          <tr>
            <th>비교 항목</th>
            <th>useState</th>
            <th>useReducer</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>상태 복잡도</td>
            <td>단순한 값 (숫자, 문자열, 불리언)</td>
            <td>복잡한 객체 / 여러 하위 값</td>
          </tr>
          <tr>
            <td>상태 업데이트</td>
            <td>직접 setter 호출</td>
            <td>action을 dispatch</td>
          </tr>
          <tr>
            <td>상태 로직 위치</td>
            <td>컴포넌트 내부에 분산</td>
            <td>reducer 함수에 집중</td>
          </tr>
          <tr>
            <td>테스트 용이성</td>
            <td>상대적으로 어려움</td>
            <td>reducer 순수 함수로 쉬움</td>
          </tr>
          <tr>
            <td>코드 가독성</td>
            <td>간단한 경우 더 명확</td>
            <td>복잡한 경우 더 명확</td>
          </tr>
          <tr>
            <td>언제 사용?</td>
            <td>
              <span className="check">✓</span> 독립적인 단순 상태
            </td>
            <td>
              <span className="check">✓</span> 관련된 상태가 여럿일 때
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <div className="info-box" style={{ borderLeftColor: '#43a047' }}>
          <h3 style={{ color: '#2e7d32' }}>useState 선택 기준</h3>
          <ul>
            <li>상태가 1~2개로 단순할 때</li>
            <li>상태 업데이트 로직이 단순할 때</li>
            <li>상태 간 의존성이 없을 때</li>
            <li>빠르게 프로토타이핑할 때</li>
          </ul>
        </div>

        <div className="info-box" style={{ borderLeftColor: '#1565c0' }}>
          <h3 style={{ color: '#1565c0' }}>useReducer 선택 기준</h3>
          <ul>
            <li>3개 이상 관련 상태가 있을 때</li>
            <li>다음 상태가 이전 상태에 의존할 때</li>
            <li>복잡한 액션 로직이 있을 때</li>
            <li>상태 로직을 테스트하고 싶을 때</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
