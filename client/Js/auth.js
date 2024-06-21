const apiUrl = 'http://localhost:3000/api';

async function register(){
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const response = await fetch(`${apiUrl}/register`, {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    // If the registration is successful, the user will be redirected to the login page
    const data = await response.json();
    if(response.ok){
        alert('Registration successful'); 
    }else{
        alert(`Error: ${data.message}`) // Error message from the server
    }
}

// Login function
async function login(){
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    
    // If the login is successful, the user will be redirected to the tasks page
    const data = await response.json();
    if(response.ok){
        localStorage.setItem('token', data.token);
        window.location.href = 'tasks.html'; // Redirect to the tasks page
    }else{
        alert(`Error: ${data.message}`); // Error message from the server
    }
}