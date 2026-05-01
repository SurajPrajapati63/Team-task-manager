# Team Task Manager

Team Task Manager is a full-stack MERN-style project for managing team projects, assigning tasks, tracking task status, and viewing dashboard statistics. It uses a React frontend, an Express REST API, JWT authentication, role-based authorization, and MongoDB with Mongoose for persistence.

## What This Project Does

The application supports two user roles:

- **Admin**: can create projects, assign members to projects, create/update/delete tasks, view all dashboard statistics, and manage team assignments.
- **Member**: can log in, view assigned work, update the status of assigned tasks, and see personal dashboard information.

The frontend provides pages for authentication, dashboard metrics, project listings, task management, and team assignment. The backend exposes protected REST APIs and keeps authentication, validation, authorization, database access, and error handling separated into clean MVC-style folders.

## Tech Stack

**Frontend**

- React 18
- Vite
- React Router
- Axios
- Lucide React icons
- Plain CSS

**Backend**

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- express-validator
- Helmet, CORS, Morgan, rate limiting

## Main Features

- User signup and login
- JWT-based protected routes
- Password hashing with bcrypt
- Admin and Member authorization
- Project creation, listing, updating, and deletion
- Add/remove members from projects
- Task creation, listing, filtering, sorting, updating, status update, and deletion
- Dashboard statistics for tasks, project progress, overdue work, and team performance
- Frontend and backend validation
- MongoDB seed script for demo data
- Postman collection for API testing

## Project Structure

```text
Team-task/
  backend/
    src/
      config/
        db.js
      controllers/
        authController.js
        dashboardController.js
        projectController.js
        taskController.js
        userController.js
      middleware/
        authMiddleware.js
        errorMiddleware.js
        validate.js
      models/
        dashboardModel.js
        projectModel.js
        taskModel.js
        userModel.js
      routes/
        authRoutes.js
        dashboardRoutes.js
        projectRoutes.js
        taskRoutes.js
        userRoutes.js
      scripts/
        seed.js
      utils/
        apiError.js
        token.js
      app.js
      server.js
    .env.example
    package.json

  frontend/
    src/
      api/
        client.js
      components/
      context/
      pages/
      utils/
      App.jsx
      main.jsx
      styles.css
    .env.example
    package.json

  docs/
    postman_collection.json

  .gitignore
  README.md
```

## Environment Variables

Create a real `.env` file inside `backend/` using `backend/.env.example` as the template.

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

Important notes:

- Do not commit `backend/.env`.
- `MONGODB_URI` must point to a running MongoDB database.
- If you use MongoDB Atlas, add your current IP address in **Atlas > Network Access**.
- `JWT_SECRET` should be a long private string in real deployments.

## Installation And Setup

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

### 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### 3. Seed Demo Data

After MongoDB is connected, run:

```bash
cd backend
npm run seed
```

This creates demo users, one project, one member assignment, and one sample task.

## Demo Accounts

After running the seed script:

```text
Admin
Email: admin@example.com
Password: Password123!

Member
Email: member@example.com
Password: Password123!
```

## Available Scripts

Backend scripts:

```bash
npm run dev     # Start backend with nodemon
npm start       # Start backend with node
npm run seed    # Insert demo data into MongoDB
```

Frontend scripts:

```bash
npm run dev       # Start Vite dev server
npm run build     # Create production build
npm run preview   # Preview production build
```

## API Overview

All protected routes require this header:

```text
Authorization: Bearer <token>
```

### Auth Routes

```text
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Project Routes

```text
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/projects/:id/members
POST   /api/projects/:id/members
DELETE /api/projects/:id/members/:userId
```

Admin-only actions:

- Create project
- Update project
- Delete project
- Add project member
- Remove project member

### Task Routes

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id/status
DELETE /api/tasks/:id
```

Admin-only actions:

- Create task
- Update task
- Delete task

Members can update task status for assigned tasks.

### User Routes

```text
GET /api/users
```

Admin-only route used for team/member lists.

### Dashboard Routes

```text
GET /api/dashboard
```

Returns task totals, project progress, overdue counts, and team performance data.

## Frontend Pages

- **Login**: authenticates users and stores the JWT.
- **Signup**: creates a new user account.
- **Dashboard**: shows task and project statistics.
- **Projects**: displays project information and progress.
- **Tasks**: lists tasks with filtering, sorting, editing, deletion, and status updates.
- **Team**: lets admins assign members to projects.

## Data Models

### User

Stores account details, hashed password, role, active status, and timestamps.

### Project

Stores project details, date range, creator, members, and timestamps.

### Task

Stores task title, description, project, assignee, creator, status, priority, due date, and timestamps.

## API Testing With Postman

A Postman collection is available at:

```text
docs/postman_collection.json
```

Recommended flow:

1. Import the collection into Postman.
2. Run login.
3. Copy the returned JWT.
4. Set the token collection variable.
5. Test protected project, task, team, and dashboard endpoints.

## Common Issues

### Failed To Connect To Database

Check that:

- `backend/.env` exists.
- `MONGODB_URI` is correct.
- MongoDB is running, or your Atlas cluster is active.
- Your current IP is allowed in MongoDB Atlas Network Access.

### Login Returns 401

This means the email/password is invalid or the user does not exist yet.

Fix:

```bash
cd backend
npm run seed
```

Then use:

```text
admin@example.com / Password123!
```

### Signup Returns 422

This means validation failed. Check that:

- Name has at least 2 characters.
- Email is valid.
- Password has at least 8 characters.
- Role is either `Admin` or `Member`.

## Notes

- `node_modules/`, build output, logs, and real `.env` files are ignored by git.
- `frontend/dist/` is generated by `npm run build` and does not need to be committed.
- The backend uses MongoDB ObjectIds, so IDs are strings.
