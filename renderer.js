const timerDisplay = document.getElementById('timer');
const statusMessage = document.getElementById('statusMessage');
const timeInput = document.getElementById('timeInput');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const closeBtn = document.querySelector('.closeBtn');
const addTaskModal = document.getElementById('addTaskModal');
const closeAddBtn = document.querySelector('.closeAddBtn');
const addTaskInput = document.getElementById('addTaskInput');
const confirmAddTaskBtn = document.getElementById('confirmAddTaskBtn');
const readySound = document.getElementById('readySound');
const alarmSound = document.getElementById('alarmSound');
const loopCountInput = document.getElementById('loopCountInput');
const breakTimeInput = document.getElementById('breakTimeInput');
const { remote } = require('electron');

let timer;
let timeLeft;
let isPaused = false;
let isBreak = false;
let loopCount = 1;
let currentLoop = 0;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    readySound.play();
    if (timer) return;

    timeLeft = parseInt(timeInput.value) * 60;
    loopCount = parseInt(loopCountInput.value); // Update loop count from input
    currentLoop = 0;
    isBreak = false;
    statusMessage.textContent = 'Focus'; // Initial message
    updateTimer();

    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimer();

            if (timeLeft <= 0) {
                if (isBreak) {
                    currentLoop++;
                    if (currentLoop >= loopCount) {
                        clearInterval(timer);
                        timer = null;
                        alarmSound.play();
                        statusMessage.textContent = 'Completed'; // Message when all loops are done
                        return;
                    }
                    timeLeft = parseInt(timeInput.value) * 60;
                    statusMessage.textContent = 'Focus'; // Message for focus time
                } else {
                    timeLeft = parseInt(breakTimeInput.value) * 60;
                    statusMessage.textContent = 'Relax'; // Message for break time
                }
                isBreak = !isBreak;
                alarmSound.play();
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.textContent = 'Resume';
    } else {
        pauseBtn.textContent = 'Pause';
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = parseInt(timeInput.value) * 60;
    statusMessage.textContent = 'Focus';
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
            li.remove();
            saveTasks();
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
    }
});

closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        editModal.style.display = 'none';
    }
});

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);

addTaskBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'block';
});

closeAddBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'none';
    addTaskInput.value = '';
});

confirmAddTaskBtn.addEventListener('click', () => {
    addTask();
});

addTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    timeLeft = parseInt(timeInput.value) * 60;
    updateTimer();
});
