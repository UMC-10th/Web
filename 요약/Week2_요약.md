# Week 2 작업 요약

## 📁 경로
`Web/junyoung/Week2/mission1/`

---

## 📌 무엇을 만드나?
Week 1의 TypeScript Todo를 **React + TypeScript**로 다시 만들기

총 3단계로 진행:

| 단계 | 내용 | 상태 |
|------|------|------|
| 1단계 | App.tsx 하나로 전부 구현 (useState) | ✅ 완료 |
| 2단계 | 컴포넌트 분리 + props-drilling 확인 | 🔲 예정 |
| 3단계 | contextAPI로 전역 상태 관리 | 🔲 예정 |

---

## 📁 파일 구조 (Vite 기본 + 우리가 수정한 것)

```
mission1/
├── src/
│   ├── App.tsx        ← 메인 컴포넌트 (우리가 작성)
│   ├── App.css        ← 스타일 (week1과 동일한 스타일 적용)
│   ├── main.tsx       ← 앱 시작점 (App을 DOM에 붙여줌)
│   └── index.css      ← 전역 스타일
├── index.html
├── package.json
└── vite.config.ts     ← Vite 설정
```

---

## ✅ 1단계: App.tsx 하나로 구현 (useState)

### Week 1과의 차이점

| | Week 1 (TypeScript) | Week 2 (React) |
|--|--|--|
| 데이터 관리 | `let todos: Todo[] = []` (일반 변수) | `useState<Todo[]>([])` (상태) |
| 화면 갱신 | `render()` 함수를 직접 호출 | state가 바뀌면 React가 자동으로 리렌더링 |
| 이벤트 | `addEventListener` | `onClick`, `onKeyDown` |
| HTML 요소 생성 | `document.createElement` | JSX로 직접 작성 |

### App.tsx 핵심 코드 구조

```tsx
// 상태 정의
const [todos, setTodos] = useState<Todo[]>([]);
const [input, setInput] = useState<string>('');

// 추가
const handleAdd = () => {
  setTodos((prev) => [...prev, { id: nextId, text, completed: false }]);
};

// 완료
const handleComplete = (id: number) => {
  setTodos((prev) =>
    prev.map((todo) => todo.id === id ? { ...todo, completed: true } : todo)
  );
};

// 삭제
const handleDelete = (id: number) => {
  setTodos((prev) => prev.filter((todo) => todo.id !== id));
};
```

### useState 포인트
- `setTodos(prev => ...)` 형태 사용 → 이전 상태 기반으로 안전하게 업데이트
- 배열 상태 변경 시 항상 새 배열을 만들어서 넘겨야 함 (직접 push 하면 안 됨)

---

## 🔲 2단계: 컴포넌트 분리 (예정)

App.tsx 하나에 있는 코드를 역할별로 쪼갤 예정:

```
src/
├── components/
│   ├── TodoInput.tsx     ← 입력창 + 추가 버튼
│   ├── TodoList.tsx      ← 할 일 목록
│   ├── DoneList.tsx      ← 완료 목록
│   └── TodoItem.tsx      ← 할 일 카드 하나
└── App.tsx               ← 위 컴포넌트들을 조합
```

이 단계에서 **props-drilling** 문제가 발생함:
- `handleAdd`, `handleComplete`, `handleDelete` 함수를 App → 자식 → 손자 컴포넌트로 계속 내려줘야 함
- 중간 컴포넌트는 쓰지도 않는데 props를 받아서 전달만 해야 하는 상황

---

## 🔲 3단계: contextAPI로 해결 (예정)

```
src/
├── context/
│   └── TodoProvider.tsx  ← todos 상태 + 함수를 전역에서 관리
├── components/
│   └── ...               ← props 없이 useContext로 직접 꺼내서 사용
└── App.tsx
```

### contextAPI 핵심 흐름
1. `createContext`로 Context 생성
2. `Provider`로 앱 전체 감싸기 (`main.tsx` 또는 `App.tsx`)
3. 필요한 컴포넌트에서 `useContext(TodoContext)` 또는 커스텀 훅으로 꺼내서 사용

---

## 💡 Week 2 핵심 개념

### JSX vs HTML
- `class` → `className`
- `onclick` → `onClick`
- 인라인 스타일: `style={{ backgroundColor: 'red' }}` (중괄호 두 번)

### useState
- 상태가 바뀌면 React가 자동으로 컴포넌트를 다시 그림
- 배열/객체는 항상 새로운 값으로 교체 (불변성 유지)

### props
- 부모 → 자식으로 데이터를 내려주는 방법
- 읽기 전용, 자식에서 수정 불가

### props-drilling
- 컴포넌트가 깊어질수록 중간 단계까지 props를 계속 전달해야 하는 문제
- contextAPI로 해결

### contextAPI
- 전역 상태를 만들어서 어느 컴포넌트에서든 바로 꺼내 쓸 수 있게 해줌
- props 없이도 데이터 공유 가능
