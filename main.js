async function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "") {
        alert("Please enter a valid username.");
    } else if (password === ""){
        alert("Please enter a password.");
    } else { 
        const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, password})
        });

        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert("Error: " + (await response.json()).error);
        }

    }
}

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "") {
        alert("Please enter a valid username.");
    } else if (password === ""){
        alert("Please enter a password.");
    } else {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, password})
        })

        if (response.ok) {
            const data = await response.json();
            document.cookie = `authToken=${data.token}; Secure; SameSite=Strict`;
            document.cookie = `username=${data.username}; Secure; SameSite=Strict`;

            window.location.href = "todo_list.html";
        } else {
            alert("Error: " + (await response.json()).error);
        }
    }
}

document.getElementById("register-btn").addEventListener("click", register);
document.getElementById("login-btn").addEventListener("click", login);