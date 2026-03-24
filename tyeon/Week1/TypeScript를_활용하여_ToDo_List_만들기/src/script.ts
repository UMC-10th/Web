const todoInput = document.getElementById("todo-input") as HTMLInputElement;
const todoForm = document.getElementById("todo-form") as HTMLFormElement;
const notYetWorks = document.getElementById("notyet-works") as HTMLUListElement;
const doneWorks = document.getElementById("done-works") as HTMLUListElement;

// const addButton = document.getElementById("add-button") as HTMLButtonElement;

type Work = {
    id: number;
    text: string;
    isDone: boolean;
}

let notYet: Work[] = [];
let done: Work[] = [];

const renderWorks = (): void => {
    notYetWorks.innerHTML = "";
    doneWorks.innerHTML = "";

    notYet.forEach(work => {
        const li = createWorkElement(work);
        notYetWorks.appendChild(li);
    });

    done.forEach(work => {
        const li = createWorkElement(work);
        doneWorks.appendChild(li);
    });
}

const getTodoText = (): string => {
    return todoInput.value.trim(); // 입력값에서 앞뒤 공백 제거
};

const addTodo = (text: string): void => {
    notYet.push({
        id: Date.now(), // 고유한 ID 생성
        text,
        isDone: false
    });

    todoInput.value = ""; // 입력 필드 초기화
    renderWorks(); // UI 업데이트
}

const switch_done = (work: Work): void => {
    notYet = notYet.filter(w => w.id !== work.id);
    done.push({ ...work, isDone: true});
    renderWorks();
}

const switch_del = (work: Work): void => {
    done = done.filter(w => w.id !== work.id);
    renderWorks();
}

const createWorkElement = (work:Work): HTMLLIElement => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");

    li.className = "render-container__work";
    span.className = "render-container__work-text";
    button.className = "render-container__work-button";

    span.textContent = work.text;

    if (!work.isDone){
        button.textContent = "완료";
        button.style.backgroundColor = "rgb(27, 88, 255)";
        button.addEventListener("click", () => {
            switch_done(work);
        });
    } else {
        button.textContent = "삭제";
        button.style.backgroundColor = "rgb(255, 27, 27)";
        button.addEventListener("click", () => {
            switch_del(work);
        });
    }

    li.appendChild(span);
    li.appendChild(button);

    if (!work.isDone) {
        notYetWorks.appendChild(li);
    } else {
        doneWorks.appendChild(li);
    }

    return li;
}

todoForm.addEventListener("submit", (event: Event): void=> {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    const text: string = getTodoText();
    
    if (text) {
        addTodo(text);
        renderWorks();
    }
});