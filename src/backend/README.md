# LearnVerse Backend API

Complete REST API for LearnVerse Learning Platform built with Node.js, Express, and MongoDB.

## Features

- ✅ User Authentication (JWT)
- ✅ Course Management
- ✅ Enrollment System
- ✅ Progress Tracking
- ✅ Reviews & Ratings
- ✅ Categories
- ✅ Wishlist
- ✅ User Profiles

## Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start server
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/:id` - Get single course
- POST `/api/courses` - Create course (Instructor/Admin)
- PUT `/api/courses/:id` - Update course (Instructor/Admin)
- DELETE `/api/courses/:id` - Delete course (Instructor/Admin)
- POST `/api/courses/:id/reviews` - Add review

### Enrollments
- POST `/api/enrollments/:courseId` - Enroll in course
- GET `/api/enrollments/my-courses` - Get my enrollments
- PUT `/api/enrollments/:id/progress` - Update progress

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create category (Admin)

### Users
- GET `/api/users/profile` - Get profile
- PUT `/api/users/profile` - Update profile
- POST `/api/users/wishlist/:courseId` - Add to wishlist
- DELETE `/api/users/wishlist/:courseId` - Remove from wishlist

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/learnverse
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
```

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt.js
- CORS
