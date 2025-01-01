// app.js
let points = 0;
let level = 1;
const pointsDisplay = document.getElementById('points');
const levelDisplay = document.getElementById('level');
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

// Load saved data from local storage
window.addEventListener('load', () => {
    try {
        points = parseInt(localStorage.getItem('points')) || 0;
        level = parseInt(localStorage.getItem('level')) || 1;
        pointsDisplay.textContent = points;
        levelDisplay.textContent = level;
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            addTask(task.text, task.completed);
        });
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    } catch (error) {
        console.error('Error loading data from local storage:', error);
    }
});

toggleDarkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const darkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkMode);
});

function createDeleteButton(li) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '❌';
    deleteButton.addEventListener('click', () => {
        if (li.classList.contains('completed')) {
            points -= 10;
            updatePoints();
        }
        li.remove();
        saveTasks();
    });
    return deleteButton;
}

function addTask(taskText, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (completed) {
        li.classList.add('completed');
    }

    const deleteButton = createDeleteButton(li);
    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        if (li.classList.contains('completed')) {
            points += 10;
        } else {
            points -= 10;
        }
        updatePoints();
        saveTasks();
    });

    li.appendChild(deleteButton);
    taskList.appendChild(li);
    taskInput.value = '';
    saveTasks();
}

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Task cannot be empty!');
        return;
    }
    addTask(taskText);
});

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            alert('Task cannot be empty!');
            return;
        }
        addTask(taskText);
    }
});

// Update Points and Level
function updatePoints() {
    pointsDisplay.textContent = points;
    const newLevel = Math.floor(points / 50) + 1;
    if (newLevel > level) {
        level = newLevel;
        alert(`🎉 Level Up! You're now at Level ${level}`);
    }
    levelDisplay.textContent = level;
    try {
        localStorage.setItem('points', points);
        localStorage.setItem('level', level);
    } catch (error) {
        console.error('Error saving points and level to local storage:', error);
    }
}

function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.textContent.replace('❌', '').trim(),
            completed: li.classList.contains('completed')
        });
    });
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks to local storage:', error);
    }
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
        console.log('Service Worker Registered');
    }).catch(error => {
        console.error('Service Worker registration failed:', error);
    });
}

if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then((swRegistration) => {
        return swRegistration.sync.register('sync-tasks');
    }).catch((error) => {
        console.error('Background sync registration failed:', error);
    });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then((swRegistration) => {
        return swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('<Your-VAPID-Public-Key>')
        });
    }).then((subscription) => {
        console.log('Push subscription:', subscription);
        // Send subscription to the server
    }).catch((error) => {
        console.error('Push subscription failed:', error);
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
