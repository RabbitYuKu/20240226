export async function addTask(event) {
  event.preventDefault();
  
  const title = document.getElementById("titleID").value;
  const description = document.getElementById("descriptionID").value;  
  const date = document.getElementById("dateID").value;    
  const userID = localStorage.getItem("userId");

  if (!userID) {
      console.error("No user ID found");
      window.location.href = "/index.html";
      return;
  }
  
  try {
      const baseUrl = 'https://script.google.com/macros/s/AKfycby4WNzL9lVE9TcaOpq5ItISxwfMs5qeRNQR-d0sJhbn8LYymPXK5JtAJehlWZvweY5W/exec';
      const params = new URLSearchParams({
          action: 'addTodo',
          userID,
          titleID: title,
          descriptionID: description,
          dateID: date
      });

      await fetch(`${baseUrl}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors'
      });

      setTimeout(() => {
          window.location.href = "html/todoList.html";
      }, 1000);

  } catch (error) {
      console.error("Error adding task:", error);
  }
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

document.getElementById('todoForm').addEventListener('submit', addTask);