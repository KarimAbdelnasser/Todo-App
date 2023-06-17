# Todo App

This is a backend application built with JavaScript and Node.js, designed to provide a robust backend solution for managing tasks in a todo application. It handles task creation, updating, and deletion, as well as task filtering based on status. The application allows users to efficiently manage their todo lists, providing a seamless experience for organizing and tracking tasks.

## Description

This project is a simple todo application developed using Node.js. It allows users to manage their tasks by adding, marking as completed, and deleting tasks. The application provides a user-friendly web interface to interact with the todo list.

### Live on Vercel: [Project Website](https://todo-app-hbs.vercel.app/)

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/KarimAbdelnasser/todo-app.git
    ```

2. Install dependencies:

    ```bash
    cd todo-app
    npm install
    ```

3. Configure environment variables:

Create a .env file in the project root directory and add the following environment variables:

    MONGO_URL= # MongoDB connection URL
    JWT_SECRET= # Secret key for JWT authentication
    PORT= # Port number for the server
    mailSender= # Email address for sending notifications
    mailPass= # Password for the email account

-   Make sure to provide the appropriate values for each environment variable.

4.  Start the server:

    ```bash
    npm run start
    ```

-   The server will start running on the specified port, and you can access the application at
    ```bash
    http://localhost:{port}.
    ```

## Prerequisites

Before running the project, ensure you have the following:

-   Node.js installed (version 14 or above)

-   MongoDB instance or connection URL

-   Email account for sending notifications

## Scripts

The following scripts are available in the project:

-   npm start: Runs the built server code using Node.js.
-   npm run dev: Runs the server in development mode using Nodemon, which automatically restarts the server on file changes.
