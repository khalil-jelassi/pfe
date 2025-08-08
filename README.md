# Node.js Authentication API

A RESTful API for user authentication built with Node.js, Express, and MongoDB.

## Features

- User registration and login
- JWT authentication
- Role-based authorization
- Password hashing with bcrypt

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=mongodb://localhost:27017/pfe-auth
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   ```
4. Make sure MongoDB is running on your system

## Running the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Login a user
- `GET /api/auth/me` - Get current user (protected route)

## User Roles
- Admin_RH
- manager
- employé (default) 