# Real-Time Collaborative Platform

A full-stack MERN application that helps teams organize their work, manage tasks, and collaborate through workspaces, boards, lists, and cards.

## 🚀 Live Demo

* **Live Client:** Add your deployed frontend URL here
* **Backend API:** Add your deployed backend URL here

## 📌 About the Project

The Real-Time Collaborative Platform is designed to make team collaboration and task management easier. Users can organize their work using workspaces and boards, create lists and cards, assign tasks, set due dates, add labels, and communicate through comments.

The application uses Socket.io to support real-time communication between connected clients.

## ✨ Features

* **User Authentication:** Sign in and access protected pages using Firebase Authentication.
* **Workspaces:** Organize team projects in workspaces.
* **Boards:** Create and manage project boards.
* **Lists:** Organize tasks into different lists.
* **Cards:** Create and manage individual tasks.
* **Drag and Drop:** Move cards between lists.
* **Card Details:** Manage task descriptions and other information.
* **Due Dates:** Set deadlines for tasks.
* **Labels:** Categorize tasks using labels.
* **Assignees:** Assign tasks to team members.
* **Comments:** Add comments to cards and view saved comments.
* **Activity Log:** View recent activities on a board.
* **Real-Time Communication:** Use Socket.io for real-time functionality.

## 🛠️ Technologies Used

### Frontend

* React
* Vite
* React Router
* Tailwind CSS
* DaisyUI
* Axios
* Firebase Authentication
* Socket.io Client
* DnD Kit

### Backend

* Node.js
* Express.js
* MongoDB
* Socket.io

### Tools

* Git and GitHub
* Firebase
* Postman or Thunder Client

## 📂 Project Structure

```text
Real-Time-Collaborative/
├── Real-Time-Collaborative-client/
│   └── real-time-client/
│       ├── public/
│       ├── src/
│       ├── .env
│       ├── package.json
│       └── vite.config.js
│
└── server/
    ├── server.js
    ├── .env
    └── package.json
```

*Adjust the backend folder name above if your actual folder has a different name.*

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB database
* Firebase project

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Set Up the Frontend

```bash
cd Real-Time-Collaborative-client/real-time-client
npm install
```

Create a `.env` file in the frontend folder and add your Firebase configuration:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id
```

Use the exact environment variable names referenced by your existing Firebase configuration file.

Start the frontend development server:

```bash
npm run dev
```

### 3. Set Up the Backend

Open a separate terminal and navigate to your backend folder.

```bash
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

Use the environment variable names expected by your existing backend code.

Start the backend server using the script defined in `package.json`. For example:

```bash
npm start
```

If your backend uses a different script, run the appropriate command.

## 🗄️ Database

The application uses MongoDB to store application data.

Database name:

`Real-Time-Collaborative`

Collections used in the application include:

* `users`
* `workspaces`
* `boards`
* `lists`
* `cards`
* `activities`

A separate comments collection may also be used, depending on your current backend implementation.

## 🔐 Authentication

Firebase Authentication is used to manage user sign-in. Protected routes restrict access to authenticated users according to the application's route configuration.

## 🔄 Real-Time Collaboration

Socket.io is used to establish a persistent connection between the frontend and backend. The application can use socket events to notify connected clients about changes to shared board data.

Real-time behavior depends on the relevant events being emitted by the backend and handled by the frontend.

## 🧑‍💻 Author

**Bibi Fatema Saima**

MERN Stack Developer

## 📄 License

This project was created for learning and portfolio purposes.
