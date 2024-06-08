// Ensure Javascript runs after html content has loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // default submission behaviour would reload page
        const specificTask = taskInput.value.trim(); // get input and remove any extra spaces
        if(specificTask !== ''){
            addTask(specificTask);
            taskInput.value = '';
        }
    });
    function addTask(specificTask){
        const li = document.createElement('li');
        li.textContent = specificTask;
        const deleteBtn = document.createElement('span');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete');
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(li);
        });
    }
});