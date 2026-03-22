// HTML에서 id로 요소를 가져옴
const todoInput = document.getElementById('todo-input') as HTMLInputElement;  // 입력창
const todoForm = document.getElementById('todo-form') as HTMLFormElement;     // 폼
const todoList = document.getElementById('todo-list') as HTMLUListElement;    // 할 일 목록
const doneList = document.getElementById('completed-list') as HTMLUListElement;    // 완료 목록

// Todo 항목의 타입 정의
type Todo = {
    id: number;   // 고유 식별자 (Date.now()로 생성)
    text: string; // 할 일 내용
};

// 할 일 / 완료 데이터 배열
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 화면에 할 일 & 완료 목록을 다시 그려주는 함수
const renderTask = (): void => {
    todoList.innerHTML = ''; // 기존 목록 초기화
    doneList.innerHTML = ''; // 기존 완료 목록 초기화

    // 할 일 목록 렌더링
    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    // 완료 목록 렌더링
    doneTasks.forEach((todo): void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

// 입력창에서 텍스트를 가져오는 함수 (앞뒤 공백 제거)
const getTodoText = (): string => {
    return todoInput.value.trim();
};

// 새 할 일을 추가하는 함수
const addTodo = (text: string): void => {
    todos.push({ id: Date.now(), text}); // 현재 시각을 id로 사용
    todoInput.value = ''; // 입력창 비우기
    renderTask();
};

// 할 일을 완료 처리하는 함수 (todos → doneTasks 이동)
const compleTask = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id); // 할 일 목록에서 제거
    doneTasks.push(todo); // 완료 목록에 추가
    renderTask();
};

// 완료된 항목을 삭제하는 함수
const deleteTask = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTask();
};

// li 요소를 생성해서 반환하는 함수
// isDone: true면 완료 항목, false면 할 일 항목
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');

    // 할 일 텍스트 span
    const text = document.createElement('span');
    text.classList.add('render-container__item-text');
    text.textContent = todo.text;
    li.appendChild(text);

    // 완료 또는 삭제 버튼
    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if(isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545'; // 빨간색
    }else{
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745'; // 초록색
    }

    // 버튼 클릭 시 완료 처리 또는 삭제
    button.addEventListener('click', (): void => {
        if(isDone) {
            deleteTask(todo);
        }else{
            compleTask(todo);
        }
    });

    li.appendChild(button);
    return li;
};

// 폼 제출 시 할 일 추가
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault(); // 페이지 새로고침 방지
    const text = getTodoText();
    if (text) { // 빈 값이 아닐 때만 추가
        addTodo(text);
    }
});

// 초기 렌더링
renderTask();
