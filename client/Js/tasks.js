const apiUrl = 'http://localhost:3000/api';

async function fetchTasks (){
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/tasks`, {
        headers: {
            'Authorization' : token
        }
    });

    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    taskList.forEach(task => { // Loop through the tasks
        const listItem = document.createElement('li'); // Create a list item
        listItem.textContent = task.task; // Display the task
        const deleteButton = document.createElement('button'); // Create a delete button
        deleteButton.textContent = 'Delete'; // Set the button text
        deleteButton.onclick = () => deleteTask(task._id); // Call the deleteTask function when the button is clicked
        listItem.appendChild(deleteButton); // Add the button to the list item
        taskList.appendChild(listItem); // Add the list item to the list
    });
}
async function addTask() {
    const task = document.getElementById('task-input').value;
    const token = localStorage.getItem('token'); // Get the token from local storage
    const response = await fetch (`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ task: taskInput })
    });

    const data = await response.json(); // Parse the JSON data
    if(response.ok){
        fetchTasks(); // Fetch the tasks again
    }else {
        alert(`Error: ${data.message}`); // Display the error message
    }
}

async function deleteTask (taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/tasks/${taksId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    });

    if(response.ok){
        fetchTasks(); // Fetch the tasks again
    }else{
        const data = await response.json();
        alert(`Error: ${data.message}`);
    }
}
