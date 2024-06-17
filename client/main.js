// Ensure Javascript runs after html content has loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');


    // Fetch tasks from the server
    fetchTasks();


    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // default submission behaviour would reload page
        const taskText = taskInput.value.trim(); // get input and remove any extra spaces
        if(taskText !== ''){
            const newTask = await createTask(taskText);
            addTaskToDOM(newTask);
            taskInput.value = '';
        }
    });

    async function fetchTasks(){
        try{
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            tasks.forEach(task => addTaskToDOM(task));
        }catch(error){
            console.error('Error fetching tasks:', error);
        }
    };

    async function createTask(text){
        try{
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            return await response.json();
        }catch (error){
            console.error('Error creating task:', error);
        }
    };
    

    function addTaskToDOM(task){
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;


        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete');
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        deleteBtn.addEventListener('click', async () => {
            await deleteTask(task.id);
            taskList.removeChild(li);
        });

        li.addEventListener('dblclick', async () => {
            const newText = prompt('Edit task:', task.text);
            if(newText !== null){
                const updatedTask = await updateTask(task.id, newText);
                li.textContent = updatedTask.text;
                li.appendChild(deleteBtn);
            }
        });
    }

    async function deleteTask(id){
        try{
            await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
        } catch(error){
            console.error('Error deleting task:', error);
        }
    }

    async function updateTask(id, text){
        try{
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            return await response.json();
        }catch(error){
            console.error('Error updating task:', error);
        }    
    }
});