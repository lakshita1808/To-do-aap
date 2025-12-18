

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    requestNotificationPermission();
    setInterval(checkDueTasks, 60000); // Check every 60 seconds for due tasks
});

document.getElementById('add-btn').addEventListener('click', addTask);

function addTask() {
    const taskInput = document.getElementById('task-input');
    const timeInput = document.getElementById('time-input');
    const taskText = taskInput.value.trim();
    const taskTime = timeInput.value;
    if (taskText) {
        const task = { text: taskText, time: taskTime, done: false, important: false };
        createTaskElement(task);
        saveTask(task);
        taskInput.value = '';
        timeInput.value = '';
    }
}

function createTaskElement(task) {
    const li = document.createElement('li');
    if (task.important) li.classList.add('important');

    const starBtn = document.createElement('button');
    starBtn.className = 'star-btn';
    starBtn.textContent = task.important ? '⭐' : '☆';
    starBtn.addEventListener('click', () => toggleImportant(starBtn, li, task));

    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = task.text;
    if (task.done) taskSpan.classList.add('done');
    taskSpan.addEventListener('click', () => {
        task.done = !task.done;
        taskSpan.classList.toggle('done');
        updateTask(task);
    });

    const timeSpan = document.createElement('span');
    timeSpan.className = 'task-time';
    timeSpan.textContent = task.time ? `Due: ${task.time}` : '';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit ✏️';
    editBtn.addEventListener('click', () => editTask(taskSpan, task));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete 🗑️';
    deleteBtn.addEventListener('click', () => {
        li.remove();
        deleteTask(task);
    });

    li.appendChild(starBtn);
    li.appendChild(taskSpan);
    li.appendChild(timeSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    document.getElementById('task-list').appendChild(li);
}

function toggleImportant(starBtn, li, task) {
    task.important = !task.important;
    starBtn.textContent = task.important ? '⭐' : '☆';
    li.classList.toggle('important');
    updateTask(task);
}

function editTask(taskSpan, task) {
    const newText = prompt('Edit task:', task.text);
    if (newText && newText.trim()) {
        task.text = newText.trim();
        taskSpan.textContent = task.text;
        updateTask(task);
    }
}

function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(createTaskElement);
}

function updateTask(updatedTask) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(t => t.text === updatedTask.text && t.time === updatedTask.time);
    if (index > -1) {
        tasks[index] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTask(taskToDelete) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(t => !(t.text === taskToDelete.text && t.time === taskToDelete.time));
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function checkDueTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const now = new Date();
    const currentTime = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
    tasks.forEach(task => {
        if (task.time === currentTime && !task.done) {
            showNotification(task);
            playAlarm();
        }
    });
}

function showNotification(task) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Task Due: ${task.text}`, {
            body: `It's time for: ${task.text}`,
            icon: 'https://via.placeholder.com/64' // Placeholder icon
        });
    } else {
        alert(`Task Due: ${task.text}`); // Fallback if notifications blocked
    }
}

function playAlarm() {
    const audio = document.getElementById('alarm-sound');
    audio.play();
}