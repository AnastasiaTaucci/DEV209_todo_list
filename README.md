# 📝 To-Do List Application

This is a **simple web-based To-Do List application** that allows users to:

- Register and log in
- Create, edit, delete, and complete tasks
- Store and manage tasks using a backend API
- Keep user sessions active via authentication tokens
- Maintain state after page refresh

## 🚀 Features

✅ **User Authentication**

- Register new users.
- Login with a username and password.
- Store authentication tokens securely in cookies.
- Logout functionality.

✅ **Task Management**

- Create to-do items with a title and description.
- Edit existing tasks (title, description, completion status).
- Delete tasks when no longer needed.
- Mark tasks as complete.

✅ **Data Persistence**

- Tasks are **stored in the backend** and **persist across sessions**.
- The **authentication session is stored in cookies**.
- **Draft tasks (title & description) remain even after page refresh**.

✅ **Extra Credit Features**

- **Saves draft input fields in `sessionStorage`** so users don't lose them on refresh.
- **Fully styled UI** with a clean and responsive design.
- **Save button replaces edit icon in edit mode** to clarify functionality.
