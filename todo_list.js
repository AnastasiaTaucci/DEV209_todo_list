let inputTitle = document.getElementById("input-title");
let inputDescription = document.getElementById("input-description");
let listContainer = document.getElementById("list-container");
let addButton = document.querySelector(".add-button");
let taskForm = document.querySelector(".form");

inputTitle.addEventListener("input", () => {
    sessionStorage.setItem("draftTitle", inputTitle.value);
})

inputDescription.addEventListener("input", () => {
    sessionStorage.setItem("draftDescription", inputDescription.value);
})



taskForm.addEventListener("click", todoInput);

function todoInput(event) {
    if (event.target === taskForm) {
        inputTitle.focus();
    }
    

    inputTitle.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            inputDescription.focus();
        }
    });

    inputDescription.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addTask();
        }
    });
}



addButton.addEventListener("click", addTask);

// function to add task to the list
async function addTask() {
    if (inputTitle.value === "") {
        alert("Please write task title");
    } else if(inputDescription.value === "") {
        alert("Please write brief task description")
    } else {
        const token = getCookie("authToken");

        const response = await fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: inputTitle.value,
                description: inputDescription.value,
                completed: false
            })
        })

        if(response.ok) {
            const newTodo = await response.json();
            createToDoItem(newTodo);

            //clear sessionstorage because the task is added
            sessionStorage.removeItem("draftTitle");
            sessionStorage.removeItem("draftDescription");

            inputTitle.value = "";
            inputDescription.value = "";

        } else {
            alert("Failed to add task: " + (await response.json()).error);
        }
    }
    
}

// function that creates a todo item
function createToDoItem(newTodo) {
    let li = document.createElement("li");
    li.setAttribute("data-id", newTodo.id);
    li.classList.toggle("checked", newTodo.completed);

    let title = document.createElement("h2");
    let description = document.createElement("p");
    title.textContent = inputTitle.value;
    description.textContent = inputDescription.value;

    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.appendChild(title);
    taskContainer.appendChild(description);
    li.appendChild(taskContainer);

    let span = document.createElement("span");
    span.textContent = "\u00d7";
    

    let editImg = document.createElement("img");
    editImg.src = "images/edit.png";
    editImg.classList.add("edit-icon")
    

    let iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    iconContainer.appendChild(span);
    iconContainer.appendChild(editImg);
    li.appendChild(iconContainer);

    listContainer.appendChild(li);

    inputTitle.value = "";
    inputDescription.value = "";
}

// function that displays a todo item previosly saved
function displayToDoItem(todo) {
    let li = document.createElement("li");
    li.setAttribute("data-id", todo.id);
    li.classList.toggle("checked", todo.completed);

    let title = document.createElement("h2");
    let description = document.createElement("p");
    title.textContent = todo.title;
    description.textContent = todo.description;

    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    taskContainer.appendChild(title);
    taskContainer.appendChild(description);
    li.appendChild(taskContainer);

    let span = document.createElement("span");
    span.textContent = "\u00d7";
    

    let editImg = document.createElement("img");
    editImg.src = "images/edit.png";
    editImg.classList.add("edit-icon")
    

    let iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    iconContainer.appendChild(span);
    iconContainer.appendChild(editImg);
    li.appendChild(iconContainer);

    listContainer.appendChild(li);
}

listContainer.addEventListener("click", async (event) => {
    if(event.target.tagName === "LI") {
        markComplete(event);
    } else if(event.target.tagName === "SPAN") {
        deleteTask(event);
    } else if(event.target.classList.contains("edit-icon")) {
        toggleEditMode(event.target);
    }
})


// Function to mark a task as complete
async function markComplete(event) {
    const li = event.target;
    li.classList.toggle("checked");
    const todoId = li.getAttribute("data-id");

    const token = getCookie("authToken");

    await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: li.classList.contains("checked") })
    })
};


// Function to delete a task
async function deleteTask(event) {
    const todoElement = event.target.parentElement.parentElement;
    const token = getCookie("authToken");
    const todoId = todoElement.getAttribute("data-id")

    const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
       method: "DELETE",
       headers: {Authorization: `Bearer ${token}`} 
    });

    if(response.ok){
        todoElement.remove();
    } else {
        alert("Failed to delete task")
    }
}

// edit mode
function toggleEditMode(editIcon) {
    let taskContainer = editIcon.parentElement.previousElementSibling;
    let titleElement = taskContainer.querySelector("h2");
    let descriptionElement = taskContainer.querySelector("p");

    let todoId = editIcon.parentElement.parentElement.getAttribute("data-id");

    // If already in edit mode, save changes
    if (editIcon.getAttribute("data-mode") === "edit") {
        saveChanges(editIcon, taskContainer, todoId);
    } else {
        // Switch to edit mode
        let titleInputEdit = document.createElement("input");
        titleInputEdit.type = "text";
        titleInputEdit.value = titleElement.textContent;

        let descriptionInputEdit = document.createElement("input");
        descriptionInputEdit.type = "text";
        descriptionInputEdit.value = descriptionElement.textContent;

        // Replace text with input fields
        taskContainer.innerHTML = "";
        taskContainer.appendChild(titleInputEdit);
        taskContainer.appendChild(descriptionInputEdit);

        // Change icon to "Save"
        editIcon.src = "images/save.png"; // Change to save icon
        editIcon.setAttribute("data-mode", "edit");

        // Focus on title input
        titleInputEdit.focus();

        // Move to description on Enter
        titleInputEdit.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                descriptionInputEdit.focus();
            }
        });


        // Save changes on Enter in description input
        descriptionInputEdit.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                saveChanges(editIcon, taskContainer,todoId);
            }
        });

        // save changes when losing focus from both inputs in edit mode
        function handleBlur() {
            setTimeout(() => {
                if (
                    document.activeElement !== titleInputEdit &&
                    document.activeElement !== descriptionInputEdit
                ) {
                    saveChanges(editIcon, taskContainer, todoId);
                }
            }, 100);
        };

        titleInputEdit.addEventListener("blur", handleBlur);
        descriptionInputEdit.addEventListener("blur", handleBlur);
    }
}

// Function to save changes
async function saveChanges(editIcon, taskContainer, todoId) {
    let titleInputEdit = taskContainer.querySelector("input:nth-child(1)");
    let descriptionInputEdit = taskContainer.querySelector("input:nth-child(2)");

    if (!titleInputEdit || !descriptionInputEdit) {
        console.log("Inputs not found, skipping saveChanges");
        return;
    }

    let updatedTitle = titleInputEdit.value;
    let updatedDescription = descriptionInputEdit.value;

    const updateToDo = {
        title: titleInputEdit.value,
        description: descriptionInputEdit.value
    };

    const token = getCookie("authToken");

    const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateToDo)
    });

    if(response.ok) {
        taskContainer.innerHTML = "";

        let titleElement = document.createElement("h2");
        titleElement.textContent = updatedTitle;

        let descriptionElement = document.createElement("p");
        descriptionElement.textContent = updatedDescription;

        // Replace inputs with text elements
        taskContainer.innerHTML = "";
        taskContainer.appendChild(titleElement);
        taskContainer.appendChild(descriptionElement);

        // Change icon back to "Edit"
        editIcon.src = "images/edit.png";
        editIcon.setAttribute("data-mode", "view");
    } else {
        alert("Failed to update task")
    }
}





// displaying todo list for a user

function getCookie(name) {
    return document.cookie
    .split("; ").
    find(row => row.startsWith(name + "="))
    ?.split("=")[1];
}

async function fetchTodos() {
    const token = getCookie("authToken");
    const username = getCookie("username");

    const response = await fetch("http://localhost:3000/todos", {
        headers: {Authorization: `Bearer ${token}`}
    });

    if (response.ok) {
        const todos = await response.json();

        //set welcome message
        document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;

        todos.forEach(todo => {
            displayToDoItem(todo);
        })
    } else {
        alert("Failed to fetch todos: " + (await response.json()).error);
    }
}



//restore saved input values from sessionstorage when the page loads
window.addEventListener("load", () => {
    let savedTitle = sessionStorage.getItem("draftTitle");
    let savedDescription = sessionStorage.getItem("draftDescription");


    if(savedTitle) {
        inputTitle.value = savedTitle;
    }

    if(savedDescription) {
        inputDescription.value = savedDescription;
    }

    fetchTodos();
});

// logout

async function logout() {
    const token = getCookie("authToken");

    const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {Authorization: `Bearer ${token}`}
    });

    if(response.ok) {
        //delete the authToken Cookie
        document.cookie = "authToken=; Max-Age=0; path=/";

        //redirect to login page
        window.location.href = "index.html";
    } else {
        const data = await response.json();
        alert("Logout failed: " + errorData.error);
    }


}

document.getElementById("logout-button").addEventListener("click", logout);