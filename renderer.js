const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let timer;
let timeLeft = 25 * 60; // 25 minutes in seconds

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
            text: li.childNodes[0].textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('editBtn');
        li.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('deleteBtn');
        li.appendChild(deleteBtn);

        if (task.completed) {
            li.classList.add('completed');
        }

        addTaskListeners(li);
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('editBtn');
    li.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('deleteBtn');
    li.appendChild(deleteBtn);

    addTaskListeners(li);
    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
}

function addTaskListeners(li) {
    const editBtn = li.querySelector('.editBtn');
    const deleteBtn = li.querySelector('.deleteBtn');

    editBtn.addEventListener('click', () => {
        const newTaskText = prompt('Edit task:', li.firstChild.textContent);
        if (newTaskText !== null) {
            li.firstChild.textContent = newTaskText;
            saveTasks();
        }
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Do you want to delete this task?')) {
            li.remove();
            saveTasks();
        }
    });

    li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            li.classList.toggle('completed');
            saveTasks();
        }
    });

    li.contentEditable = true;
    li.addEventListener('blur', saveTasks);
}

startBtn.addEventListener('click', startTimer);
resetBtn.addEventListener('click', resetTimer);
addTaskBtn.addEventListener('click', addTask);

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateTimer();
});
