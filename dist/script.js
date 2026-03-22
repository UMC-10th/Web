"use strict";
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoItems = document.getElementById('todoItems');
const doneItems = document.getElementById('doneItems');
function handleAddTodo() {
    if (!todoInput)
        return;
    const text = todoInput.value.trim();
    if (text !== "") {
        addTodo(text);
        todoInput.value = "";
        todoInput.focus();
    }
}
todoInput === null || todoInput === void 0 ? void 0 : todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.isComposing) {
        handleAddTodo();
    }
});
addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener('click', handleAddTodo);
function addTodo(text) {
    if (!todoItems)
        return;
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);
    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-container';
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '완료';
    completeBtn.className = 'complete-btn';
    completeBtn.onclick = () => moveToDone(li);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => li.remove();
    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(deleteBtn);
    li.appendChild(btnContainer);
    todoItems.appendChild(li);
}
function moveToDone(li) {
    if (!doneItems)
        return;
    const completeBtn = li.querySelector('.complete-btn');
    if (completeBtn)
        completeBtn.remove();
    doneItems.appendChild(li);
}
