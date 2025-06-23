# Admin Product Management Dashboard

A full-stack web application for managing products with a user-friendly admin dashboard. Users can register, log in, and perform CRUD operations on products, including image uploads. The application is containerized using Docker for easy setup and deployment.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Clone the Repository](#clone-the-repository)
  - [Environment Variables](#environment-variables)
  - [Run with Docker](#run-with-docker)
  - [Run Locally (Without Docker)](#run-locally-without-docker)
- [API Documentation](#api-documentation)
- [License](#license)

## Features

- **User Authentication**: JWT-based authentication with login, signup, logout, and protected routes.
- **Product Management**: Create, Read, Update, Delete (CRUD) operations for products.
- **Image Uploads**: Integrated with imgBB for product image uploads.
- **Dashboard**: Admin dashboard for managing products with real-time updates.
- **Role-Based Access**: Custom guards (e.g., `isOwner`) to restrict access to resources.
- **API Versioning**: Backend APIs are versioned (e.g., `/v1`).
- **Database Migrations**: TypeORM migrations for managing database schema changes.
- **Swagger Documentation**: Auto-generated API documentation using Swagger.
- **State Management**: React Context API for managing global state in the frontend.
- **Protected Routes**: Secure frontend routes using custom hooks and protected route components.
- **Responsive UI**: Built with Ant Design for a modern and responsive interface.
- **Containerized**: Dockerized setup with Docker Compose for consistent development and deployment.

## Tech Stack

### Backend

- **NestJS**: A progressive Node.js framework for building scalable server-side applications.
- **TypeORM**: ORM for PostgreSQL database management.
- **JWT**: JSON Web Tokens for authentication.
- **Swagger**: API documentation.
- **imgBB**: Third-party service for image uploads.
- **Docker**: Containerization for consistent environments.

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast development.
- **Ant Design**: UI component library for a modern and responsive design.
- **Context API**: State management for global application state.
- **TypeScript**: Static typing for improved code quality.
- **Custom Hooks**: Reusable logic for API calls, authentication, and more.
- **Docker**: Containerized frontend for consistency.

### Database

- **PostgreSQL**: Relational database for storing user and product data.

### DevOps

- **Docker & Docker Compose**: For containerization and orchestration.
- **ESLint**: For code linting in both frontend and backend.
- **Vercel**: Optional deployment configuration for frontend (if used).

## Project Structure

```
├── backend
│   ├── dist                    # Compiled JavaScript files
│   ├── Dockerfile              # Docker configuration for backend
│   ├── eslint.config.mjs       # ESLint configuration
│   ├── nest-cli.json           # NestJS CLI configuration
│   ├── package.json            # Backend dependencies
│   ├── src                     # Backend source code
│   │   ├── app.module.ts       # Main application module
│   │   ├── auth                # Authentication module (controllers, services, guards)
│   │   ├── common              # Shared utilities and filters
│   │   ├── config              # Configuration files (e.g., environment variables)
│   │   ├── dashboard           # Dashboard-related module
│   │   ├── main.ts             # Application entry point
│   │   ├── product             # Product management module
│   │   └── user                # User management module
│   ├── test                    # E2E tests
│   ├── tsconfig.json           # TypeScript configuration
│   └── vercel.json             # Vercel deployment configuration (optional)
├── docker-compose.yml          # Docker Compose configuration
├── frontend
│   ├── Dockerfile              # Docker configuration for frontend
│   ├── eslint.config.js        # ESLint configuration
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── public                  # Static assets
│   ├── src                     # Frontend source code
│   │   ├── App.tsx             # Main React component
│   │   ├── assets              # Images and other static assets
│   │   ├── components          # Reusable UI components
│   │   ├── constants           # Centralized constants (e.g., API endpoints)
│   │   ├── context             # Context API for state management
│   │   ├── hooks               # Custom React hooks
│   │   ├── index.css           # Global styles
│   │   ├── main.tsx            # React application entry point
│   │   ├── pages               # Page components (e.g., Login, Dashboard)
│   │   ├── routes              # Route definitions
│   │   ├── services            # API service functions
│   │   ├── utils               # Utility functions
│   │   └── vite-env.d.ts       # Vite environment type definitions
│   ├── tsconfig.json           # TypeScript configuration
│   └── vite.config.ts          # Vite configuration
└── README.md                   # Project documentation
```

## Prerequisites

- **Node.js**: v20 or higher
- **Docker**: Latest stable version
- **Docker Compose**: Latest stable version
- **PostgreSQL**: If running locally without Docker
- **imgBB API Key**: For image uploads (sign up at [imgBB](https://imgbb.com/))

## Setup Instructions

### Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### Environment Variables

1. **Backend**:
   Create a `.env` file in the `backend` directory with the following:

   ```env
   # Port
   PORT=3000
   ENV=development

   # Database
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=yourpassword
   DB_NAME=admin_panel
   LOW_STOCK_THRESHOLD=5

   # JWT Secret
   COOKIE_EXPIRATION_TIME=supersecretjwtkey
   JWT_EXPIRATION_TIME=1d

   # Cookie
   COOKIE_EXPIRE_DAY=1

   # imgBB
   IMGBB_API_KEY=<your-imgbb-api-key>

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

#### Steps to get the imgBB API Key:

- Sign up at [imgBB](https://imgbb.com/login).
- Visit the [API documentation](https://api.imgbb.com/) to generate your API key.

2. **Frontend**:
   Create a `.env` file in the `frontend` directory with the following:
   ```env
   VITE_API_URL=http://localhost:3000/v1
   ```

### Run with Docker

1. Ensure Docker and Docker Compose are installed.
2. From the project root, run:
   ```bash
   docker-compose up --build
   ```
3. Access the application:

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/v1`
   - Swagger Docs: `http://localhost:3000/api/docs`

4. To stop the containers:
   ```bash
   docker-compose down
   ```

### Run Locally (Without Docker)

1. **Backend**:

   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start a PostgreSQL database locally or update `.env` to point to a remote database.
   - Run migrations:
     ```bash
     npm run migration:run
     ```
   - Start the backend:
     ```bash
     npm run start:dev
     ```

2. **Frontend**:

   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend:
     ```bash
     npm run dev
     ```

3. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/v1`

## API Documentation

- Swagger documentation is available at `http://localhost:3000/api/docs` when the backend is running.
- Key endpoints include:
  - `/v1/auth/signup`: Register a new user
  - `/v1/auth/login`: User login
  - `/v1/products`: CRUD operations for products
  - `/v1/dashboard`: Dashboard data (protected)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
