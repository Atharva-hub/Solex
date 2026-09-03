# Solex

Solex is a full-stack shoe store application with a React frontend and an Express/MongoDB backend.

## Stack

- Frontend: React 19, Vite, React Router, Bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT
- Image uploads: Multer

## Project Structure

```text
backend/              Express API and MongoDB integration
frontend/solex/       React and Vite application
backend/upload/       Uploaded shoe images
```

## Prerequisites

- Node.js 18 or later
- MongoDB database, local or hosted

## Setup

1. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create `backend/.env`:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=4000
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend/solex
   npm install
   ```

## Run Locally

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend/solex
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://localhost:4000` by default.

## Available Scripts

### Backend

- `npm run dev` starts the API with Nodemon.

### Frontend

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run preview` previews the production build locally.
- `npm run lint` runs ESLint.

## API Routes

- `/api/users` handles user registration, login, and user administration.
- `/api/shoes` handles shoe catalog operations.
- `/uploads` serves uploaded shoe images.
