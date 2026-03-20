"use strict";
const todoInput = document.getElementById("todo-input");
const todoForm = document.getElementById("todo-form");
const notYetWorks = document.getElementById("notyet-works");
const doneWorks = document.getElementById("done-works");
let notYet = [];
let done = [];
const renderWorks = () => {
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
};
const getTodoText = () => {
    return todoInput.value.trim();
};
const addTodo = (text) => {
    notYet.push({
        id: Date.now(),
        text,
        isDone: false
    });
    todoInput.value = "";
    renderWorks();
};
const switch_done = (work) => {
    notYet = notYet.filter(w => w.id !== work.id);
    done.push(Object.assign(Object.assign({}, work), { isDone: true }));
    renderWorks();
};
const switch_del = (work) => {
    done = done.filter(w => w.id !== work.id);
    renderWorks();
};
const createWorkElement = (work) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    li.className = "render-container__work";
    span.className = "render-container__work-text";
    button.className = "render-container__work-button";
    span.textContent = work.text;
    if (!work.isDone) {
        button.textContent = "완료";
        button.style.backgroundColor = "rgb(27, 88, 255)";
        button.addEventListener("click", () => {
            switch_done(work);
        });
    }
    else {
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
    }
    else {
        doneWorks.appendChild(li);
    }
    return li;
};
todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
        renderWorks();
    }
});
