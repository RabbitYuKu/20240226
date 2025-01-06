const API_URL = 'https://script.google.com/macros/s/AKfycby4WNzL9lVE9TcaOpq5ItISxwfMs5qeRNQR-d0sJhbn8LYymPXK5JtAJehlWZvweY5W/exec';
const tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

async function initializePage() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "/index.html";
        return;
    }

    await loadTasks();
    setupEventListeners();
}

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}?action=todoList&userID=${localStorage.getItem("userId")}`);
        const data = await response.json();
        tasks.push(...data);
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

function renderTasks() {
    const container = document.getElementById('tilesContainer');
    container.innerHTML = '';

    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        container.appendChild(taskElement);
    });
}

function createTaskElement(task, index) {
    const params = new URLSearchParams(task);
    const title = params.get('titleID');
    const description = params.get('descriptionID');

    const taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';

    const titleElement = document.createElement('div');
    titleElement.className = 'tile-item';
    titleElement.textContent = title;
    titleElement.onclick = () => toggleSubmenu(titleElement);

    const details = createTaskDetails(description, index);

    taskContainer.appendChild(titleElement);
    taskContainer.appendChild(details);

    return taskContainer;
}

function createTaskDetails(description, index) {
    const details = document.createElement('div');
    details.className = 'subtile';

    const content = document.createElement('div');
    content.className = 'subtile-item';
    content.innerHTML = `<p>${description}</p>`;

    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.id = index;
    startButton.className = 'subtile-button';
    startButton.textContent = 'Start Working';
    startButton.onclick = () => startTask(index);

    details.appendChild(content);
    details.appendChild(startButton);

    return details;
}

function startTask(index) {
    localStorage.setItem("task", tasks[index]);
    window.location.href = "/timer.html";
}

function setupEventListeners() {
    document.getElementById("addButton").onclick = () => {
        window.location.href = "/addtodo.html";
    };
}

export function toggleDropdown() {
    const dropdown = document.getElementById("myDropdown");
    const overlay = document.getElementById("myOverlay");
    dropdown.classList.toggle("show");
    overlay.classList.toggle("show");
}

export function closeDropdown() {
    const dropdown = document.getElementById("myDropdown");
    const overlay = document.getElementById("myOverlay");
    dropdown.classList.remove("show");
    overlay.classList.remove("show");
}

function toggleSubmenu(menuItem) {
    const submenu = menuItem.nextElementSibling;
    submenu.classList.toggle('open');
}