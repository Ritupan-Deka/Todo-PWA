// app.js
let points = 0;
let level = 1;
const pointsDisplay = document.getElementById('points');
const levelDisplay = document.getElementById('level');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');

// Add Task
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.addEventListener('click', () => li.remove());

    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        if (li.classList.contains('completed')) {
            points += 10; // 10 points per task
            updatePoints();
        }
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
    taskInput.value = '';
});

// Update Points and Level
function updatePoints() {
    pointsDisplay.textContent = points;
    const newLevel = Math.floor(points / 50) + 1; // 50 points per level
    if (newLevel > level) {
        level = newLevel;
        alert(`🎉 Level Up! You're now at Level ${level}`);
    }
    levelDisplay.textContent = level;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
        console.log('Service Worker Registered');
    });
}
