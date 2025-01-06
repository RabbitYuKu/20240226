let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    copyTile();
    initializeTimer();
});

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

function initializeTimer() {
    const startButton = document.getElementById("startButton");
    if (startButton) {
        startButton.addEventListener("click", startCountdown);
    }
}

function startCountdown() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    let totalTime = 360; // 6 minutes in seconds
    let timePassed = 0;
    const timeDisplay = document.getElementById('time');
    
    updateTimerDisplay();
    timerInterval = setInterval(updateTimer, 1000);

    function updateTimer() {
        timePassed++;
        updateTimerDisplay();
        
        if (timePassed >= totalTime) {
            clearInterval(timerInterval);
            notifyTimerComplete();
        }
    }

    function updateTimerDisplay() {
        const percentage = (timePassed / totalTime) * 100;
        document.querySelector('.timer').style.background = 
            `conic-gradient(#AEC7CF ${percentage}%, #44465e ${percentage}%)`;
        
        const hours = Math.floor(timePassed / 3600);
        const minutes = Math.floor((timePassed % 3600) / 60);
        const seconds = timePassed % 60;
        
        timeDisplay.textContent = 
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function notifyTimerComplete() {
    // Add notification logic here
    console.log('Timer completed!');
}

function copyTile() {
    const task = localStorage.getItem("task");
    if (!task) return;

    const params = new URLSearchParams(task);
    const title = params.get('titleID');
    const description = params.get('descriptionID');
    
    createTileElement(title, description);
}

function createTileElement(title, description) {
    const tilesContainer = document.getElementById('tilesContainer');
    
    const tileItem = createElementWithClass('div', 'timertile-item');
    tileItem.onclick = () => toggleSubmenu(tileItem);
    tileItem.textContent = title;

    const subtile = createElementWithClass('div', 'timersubtile');
    const subtileItem = createElementWithClass('div', 'timersubtile-item');
    subtileItem.id = 'subtile';

    const p = document.createElement('p');
    p.textContent = description;

    const startButton = document.createElement('input');
    startButton.type = 'button';
    startButton.className = 'subtile-button';
    startButton.value = 'Start Working';
    startButton.id = 'startButton';

    appendElements(subtileItem, [p]);
    appendElements(subtile, [subtileItem, startButton]);
    appendElements(tilesContainer, [tileItem, subtile]);
}

function createElementWithClass(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function appendElements(parent, children) {
    children.forEach(child => parent.appendChild(child));
}