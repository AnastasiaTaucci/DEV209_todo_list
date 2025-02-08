document.getElementById("auth-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();
    const submitButton = event.submitter.id;

    if (username === "") {
        alert("Please enter a valid username.");
    } else if (password === ""){
        alert("Please enter a password.");
    } else {
        if (submitButton === "register-btn") {
            register(username, password);
        } else if (submitButton === "login-btn") {
            login(username, password);
        }
    }
})






async function register(username, password) {
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

async function login(username,password) {
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
