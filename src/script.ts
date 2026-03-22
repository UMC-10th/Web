// 1. 요소 가져오기
const todoInput = document.getElementById('todoInput') as HTMLInputElement | null;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement | null;
const todoItems = document.getElementById('todoItems') as HTMLUListElement | null;
const doneItems = document.getElementById('doneItems') as HTMLUListElement | null;

// 2. 추가 로직 함수화
function handleAddTodo(): void {
    if (!todoInput) return;
    
    const text: string = todoInput.value.trim();
    if (text !== "") {
        addTodo(text);
        todoInput.value = ""; // 입력창 초기화
        todoInput.focus();    // 다시 포커스
    }
}

// 3. 이벤트 연결
// 엔터 키 이벤트 (한글 중복 입력 방지 추가)
todoInput?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.isComposing) {
        handleAddTodo();
    }
});

// 클릭 이벤트
addBtn?.addEventListener('click', handleAddTodo);

// 4. 할 일 아이템 생성 함수
function addTodo(text: string): void {
    if (!todoItems) return;

    const li = document.createElement('li');
    
    // 텍스트 영역
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    // 버튼 컨테이너
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';

    // 완료 버튼
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '완료';
    completeBtn.className = 'complete-btn';
    completeBtn.onclick = () => moveToDone(li);

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => li.remove();

    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(deleteBtn);
    li.appendChild(btnContainer);

    todoItems.appendChild(li);
}

// 5. 완료 처리 함수
function moveToDone(li: HTMLLIElement): void {
    if (!doneItems) return;

    // 완료 버튼만 찾아 제거
    const completeBtn = li.querySelector('.complete-btn');
    if (completeBtn) completeBtn.remove();
    
    // 완료 목록으로 이동
    doneItems.appendChild(li);
}