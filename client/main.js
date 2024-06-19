// Ensure Javascript runs after html content has loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authContainer = document.getElementById('auth-container');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    let token = '';

    const apiUrl = 'http://localhost:3000/api'; // API URL for the server
     

    // Fetch tasks from the server
    const fetchTasks = async () => {
        try{
            const response = await fetch(`${apiUrl}/tasks`, {
                headers: {
                    'Authorization': token
                }
            });
            const tasks = await response.json();
            todoList.innerHTML = '';
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.textContent = task.text;
                if(task.completed) {
                    taskItem.classList.add('completed');
                }
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('btn-danger');
                deleteBtn.onclick = async () => {
                    await fetch (`${apiUrl}/tasks/${task.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': token,
                        },
                    });
                    fetchTasks();
                };
                taskItem.appendChild(deleteBtn);
                todoList.appendChild(taskItem);
            });
        }catch(error){
                console.error('Error fetching tasks:', error);
        }
    };

    const authenticateUser = async (url, username, password) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (data.token) {
                token = data.token;
                authContainer.style.display = 'none';
                fetchTasks();
            } else {
                alert(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
        }
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = newTaskInput.value.trim();
        if (text) {
            addTask(text);
            newTaskInput.value = '';
        }
    });

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        authenticateUser(`${apiUrl}/auth/login`, username, password);
    });

    registerBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        authenticateUser(`${apiUrl}/auth/register`, username, password);
    });
});

