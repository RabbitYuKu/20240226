const API_URL = 'https://script.google.com/macros/s/AKfycby4WNzL9lVE9TcaOpq5ItISxwfMs5qeRNQR-d0sJhbn8LYymPXK5JtAJehlWZvweY5W/exec';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const statusMessage = document.getElementById('statusMessage');
    
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitButton = document.querySelector('.submit-button');
    
    if (!validateForm(email, password)) return;
    
    toggleLoadingState(true);
    
    try {
        const params = new URLSearchParams({
            action: 'login',
            userID: email,
            pwd: password
        });

        const response = await fetch(`${API_URL}?${params.toString()}`);
        const result = await response.text();

        if (result === 'true') {
            localStorage.setItem('userId', email);
            showStatus('success', 'Welcome! Redirecting...');
            setTimeout(() => window.location.href = '/todoList.html', 2000);
        } else {
            showStatus('error', 'Invalid email or password');
            setTimeout(() => toggleLoadingState(false), 2000);
        }
    } catch (error) {
        showStatus('error', 'An error occurred. Please try again.');
        toggleLoadingState(false);
    }
}

function validateForm(email, password) {
    let isValid = true;
    
    if (!email || !email.includes('@')) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError('passwordError', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

function showStatus(type, message) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type} visible`;
}

function toggleLoadingState(isLoading) {
    const submitButton = document.querySelector('.submit-button');
    const spinner = document.querySelector('.spinner');
    const buttonText = document.querySelector('.button-text');
    
    spinner.classList.toggle('hidden', !isLoading);
    buttonText.classList.toggle('hidden', isLoading);
    submitButton.disabled = isLoading;
}