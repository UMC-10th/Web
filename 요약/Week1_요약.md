# Week 1 작업 요약

## 📁 경로
`Web/junyoung/Week1/chapter1/`

---

## 📌 무엇을 만들었나?
**YONG TODO** — TypeScript로 만든 할 일 관리 앱

기능:
- 할 일 추가 (입력창 + 버튼 or Enter)
- 완료 처리 → 완료 칸으로 이동
- 삭제

---

## 📁 파일 구조

```
chapter1/
├── src/
│   └── index.ts       ← 실제 로직 (TypeScript 소스)
├── dist/
│   └── index.js       ← tsc가 컴파일한 결과 (자동생성, 직접 수정 X)
├── index.html         ← 뼈대 HTML
├── style.css          ← 스타일
├── tsconfig.json      ← TypeScript 설정
└── package.json       ← 프로젝트 설정
```

---

## 📄 파일별 역할

### index.html
- 입력창(`#todo-input`), 버튼(`#add-btn`), 목록(`#todo-list`, `#done-list`) 정의
- 맨 아래에 `<script src="dist/index.js">` 로 컴파일된 JS를 로드

### src/index.ts
- `Todo` 인터페이스로 데이터 구조 정의 (`id`, `text`, `completed`)
- `todos` 배열로 전체 할 일 데이터 관리
- 핵심 함수 3개:
  - `addTodo()` — 입력값 → 배열에 추가 → 화면 갱신
  - `completeTodo(id)` — 해당 항목 `completed = true`
  - `deleteTodo(id)` — 해당 항목 배열에서 제거
- `render()` — 매번 목록을 비우고 배열 전체를 다시 그림

### style.css
- BEM 방식 네이밍 사용
  - `.todo-item` → 카드 한 장
  - `.todo-item__text` → 카드 안 텍스트 (`__` = 자식 요소)
  - `.todo-item__btn` → 카드 안 버튼
  - `.todo-item--done` → 완료 상태 (`--` = 상태 변형)

---

## ⚠️ 발생했던 문제와 해결

### 문제 1: 할 일 추가가 아예 안 됨
- **원인**: `src/index.ts` 파일 자체가 없어서 `dist/index.js`가 없었음 → HTML이 스크립트를 로드 못 함
- **해결**: `src/index.ts` 생성 → `npm install` → `npx tsc` 컴파일

### 문제 2: UI 스타일이 적용 안 됨 (버튼이 작고 카드 모양이 없음)
- **원인**: CSS는 `.todo-item`, `.todo-item__btn` 클래스로 스타일을 정의했는데,
  JS에서 생성하는 `li`, `button` 요소에 해당 클래스를 추가하지 않음
- **해결**: `render()` 함수에서 요소 생성 시 `classList.add()` 로 BEM 클래스 추가

---

## 🔄 전체 흐름

```
버튼 클릭 or Enter
  → addTodo() 실행
  → todos 배열에 항목 추가
  → render() 호출
  → HTML 목록을 전부 지우고 새로 그림
  → 화면에 표시
```

---

## 💡 핵심 개념

- **TypeScript 타입 캐스팅**: `document.getElementById("todo-input") as HTMLInputElement`
  - getElementById의 반환 타입은 `HTMLElement | null`
  - `.value` 같은 input 전용 속성을 쓰려면 타입을 좁혀줘야 함
- **`tsc` 컴파일**: `.ts` 파일을 `.js`로 변환하는 과정. 브라우저는 TypeScript를 직접 읽지 못함
- **BEM 네이밍**: CSS 클래스 이름을 `블록__요소--수식어` 형태로 규칙적으로 짓는 방법
