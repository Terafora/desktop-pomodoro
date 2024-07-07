// Select timer and status elements
const timerDisplay = document.getElementById('timer');
const statusMessage = document.getElementById('statusMessage');

// Select input elements for time, loops, and breaks
const timeInput = document.getElementById('timeInput');
const loopCountInput = document.getElementById('loopCountInput');
const breakTimeInput = document.getElementById('breakTimeInput');

// Select control buttons
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Select task elements and modals
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

// Select audio elements for sounds
const readySound = document.getElementById('readySound');
const alarmSound = document.getElementById('alarmSound');

// Timer and loop state variables
let timer;
let timeLeft;
let isPaused = false;
let isBreak = false;
let loopCount = 1;
let currentLoop = 0;

// Select and calculate the progress ring's circumference
const circle = document.querySelector('.progress-ring__circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

// Set the stroke dash array and offset for the circle
circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

// Function to set the progress of the ring
function setProgress(percent) {
    const offset = circumference * (1 - percent / 100);
    circle.style.strokeDashoffset = -offset;
}

// Function to update the timer display and progress ring
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const totalSeconds = isBreak ? parseInt(breakTimeInput.value) * 60 : parseInt(timeInput.value) * 60;
    const percent = (timeLeft / totalSeconds) * 100;
    setProgress(percent);
}

// Function to start the timer
function startTimer() {
    readySound.play();
    if (timer) return;

    // Initialize timer and loop state
    timeLeft = parseInt(timeInput.value) * 60;
    loopCount = parseInt(loopCountInput.value);
    currentLoop = 0;
    isBreak = false;

    // Set initial status and ring color
    statusMessage.textContent = 'Focus';
    circle.style.stroke = 'green';
    updateTimer();

    // Start the interval timer
    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateTimer();

            // Handle timer end
            if (timeLeft <= 0) {
                if (isBreak) {
                    currentLoop++;
                    if (currentLoop >= loopCount) {
                        clearInterval(timer);
                        timer = null;
                        alarmSound.play();
                        statusMessage.textContent = 'Completed';
                        return;
                    }
                    timeLeft = parseInt(timeInput.value) * 60;
                    statusMessage.textContent = 'Focus';
                    circle.style.stroke = 'green';
                } else {
                    timeLeft = parseInt(breakTimeInput.value) * 60;
                    statusMessage.textContent = 'Relax';
                    circle.style.stroke = 'orange';
                }
                isBreak = !isBreak;
                alarmSound.play();
            }
        }
    }, 1000);
}

// Function to pause or resume the timer
function pauseTimer() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseBtn.textContent = '▶';
    } else {
        pauseBtn.textContent = '⏸';
    }
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = parseInt(timeInput.value) * 60;
    statusMessage.textContent = 'Focus';
    circle.style.stroke = 'green';
    updateTimer();
}

// Function to save tasks to localStorage
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

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskElement(task.text, task.completed);
    });
}

// Function to add a task element to the DOM
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

// Function to handle adding a new task
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

// Function to add listeners to task elements
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

// Handle saving edits to tasks
saveEditBtn.addEventListener('click', () => {
    if (currentEditTask) {
        currentEditTask.textContent = editTaskInput.value.trim();
        saveTasks();
        editModal.style.display = 'none';
    }
});

// Handle closing the edit modal
closeBtn.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Handle closing modals by clicking outside of them
window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        editModal.style.display = 'none';
    }
});

// Event listeners for timer controls
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Event listener for adding a task
addTaskBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'block';
});

// Event listener for closing the add task modal
closeAddBtn.addEventListener('click', () => {
    addTaskModal.style.display = 'none';
    addTaskInput.value = '';
});

// Event listener for confirming a task addition
confirmAddTaskBtn.addEventListener('click', () => {
    addTask();
});

// Event listener for adding a task with the Enter key
addTaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial loading of tasks and timer setup
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    timeLeft = parseInt(timeInput.value) * 60;
    updateTimer();
});
