const API_URL = 'https://script.google.com/macros/s/AKfycby4WNzL9lVE9TcaOpq5ItISxwfMs5qeRNQR-d0sJhbn8LYymPXK5JtAJehlWZvweY5W/exec';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', handleRegister);
});

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!validateForm(email, password, confirmPassword)) return;
    
    toggleLoadingState(true);
    
    try {
        const params = new URLSearchParams({
            action: 'register',
            userID: email,
            pwd: password
        });

        const response = await fetch(`${API_URL}?${params.toString()}`);
        const result = await response.text();

        if (result === 'true') {
            showStatus('success', 'Registration successful! Redirecting...');
            localStorage.setItem('userId', email);
            setTimeout(() => window.location.href = '/todoList.html', 2000);
        } else {
            showStatus('error', 'User already exists');
            setTimeout(() => toggleLoadingState(false), 2000);
        }
    } catch (error) {
        showStatus('error', 'Registration failed. Please try again.');
        toggleLoadingState(false);
    }
}

function validateForm(email, password, confirmPassword) {
    let isValid = true;
    
    if (!email || !email.includes('@')) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password || password.length < 6) {
        showError('passwordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
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