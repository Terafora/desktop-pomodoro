const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const closeBtn = document.querySelector('.closeBtn');
const { remote } = require('electron');


let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds
let currentEditTask;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timer) return;

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateTimer();
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskElement(task.text, task.completed);
    });
}

function addTaskElement(taskText, completed = false) {
    console.log('Adding task element:', taskText); // Debug log
    const li = document.createElement('li');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.classList.add('task-text');
    li.appendChild(taskSpan);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('editBtn');
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('deleteBtn');
    li.appendChild(deleteBtn);

    if (completed) {
        li.classList.add('completed');
    }

    addTaskListeners(li);
    taskList.appendChild(li);
}

function addTask() {
    const taskText = addTaskInput.value.trim();
    if (taskText === '') {
        console.log('Task input is empty, not adding task'); // Debug log
        return;
    }

    addTaskElement(taskText);
    addTaskInput.value = '';
    saveTasks();
    addTaskModal.style.display = 'none';
}

function addTaskListeners(li) {
    const editBtn = li.querySelector('.editBtn');
    const deleteBtn = li.querySelector('.deleteBtn');
    const taskSpan = li.querySelector('.task-text');

    editBtn.addEventListener('click', () => {
        currentEditTask = taskSpan;
        editTaskInput.value = taskSpan.textContent;
        editModal.style.display = 'block';
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Do you want to delete this task?')) {
            console.log('Deleting task:', taskSpan.textContent); // Debug log
            li.remove();
            saveTasks();
            addTaskInput.focus(); // Ensure input field regains focus
        }
    });

    li.addEventListener('click', (e) => {
        if (e.target !== editBtn && e.target !== deleteBtn) {
            li.classList.toggle('completed');
            saveTasks();
        }
    });
}

saveEditBtn.addEventListener('click', () => {
    if (currentEditTask) {
        currentEditTask.textContent = editTaskInput.value.trim();
        saveTasks();
        editModal.style.display = 'none';
        addTaskInput.focus(); // Ensure input field regains focus
    }
});

closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
    addTaskInput.focus(); // Ensure input field regains focus
});

window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        editModal.style.display = 'none';
        addTaskInput.focus(); // Ensure input field regains focus
    }
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

// Open Add Task Modal
addTaskBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'block';
    addTaskInput.focus(); // Ensure input field gains focus
});

// Close Add Task Modal
closeAddBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'none';
    addTaskInput.value = ''; // Clear input field
});

// Confirm Add Task
confirmAddTaskBtn.addEventListener('click', () => {
    addTask();
});

// Add task on Enter key in modal
addTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateTimer();
});

const { remote } = require('electron');

let isDragging = false;
let offset = { x: 0, y: 0 };

const move = document.getElementById('titlebar');

move.addEventListener('mousedown', (e) => {
    isDragging = true;
    const currentWindow = remote.getCurrentWindow();
    offset = {
        x: e.screenX - currentWindow.getBounds().x,
        y: e.screenY - currentWindow.getBounds().y
    };
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const currentWindow = remote.getCurrentWindow();
        let newX = e.screenX - offset.x;
        let newY = e.screenY - offset.y;
        currentWindow.setPosition(newX, newY);
    }
});
