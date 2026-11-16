# MERN Markdown Note-Taking App

A simple and practical note-taking application that I built to improve my full-stack development skills.

The idea behind this project was to create a place where users can write, organize, edit, and manage their notes using Markdown. While building it, I got hands-on experience working with the frontend, backend, database, and authentication together.

## What can you do with it?

- Create an account and log in securely.
- Create, edit, and delete your notes.
- Write notes using Markdown and see a live preview.
- Organize notes using tags.
- Access your saved notes even after refreshing the page.
- Keep each user's notes private through protected API routes.

## Technologies I used

**Frontend**
- React
- Vite
- Axios
- React Markdown
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt

## How the project is organized

The project has two main parts:

- `client` – Handles the user interface and everything users interact with.
- `server` – Handles authentication, note operations, API routes, and database communication.

## Run the project locally

If you want to run this project on your computer, follow these steps.

### 1. Clone the repository

```bash
git clone (https://github.com/anukulchoudhary07/Mern-markdown-notes)
cd mern-markdown-notes
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder and add your own configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Set up the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL shown in your terminal to use the application.

## Production build

To create a production build of the frontend:

```bash
cd client
npm run build
```

The generated files will be available in the `client/dist` folder.

## A little about the project

This is one of my hands-on MERN stack projects. I built it to move beyond just learning individual technologies and understand how a complete application works.

It helped me practice React state management, REST APIs, authentication, database operations, and connecting a frontend with a backend.

I'm continuing to improve the project as I learn more about full-stack development.

---

**Built as a learning project using the MERN stack.**
