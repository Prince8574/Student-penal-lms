<div align="center">

# LEARNING MANAGEMENT SYSTEM
## Student Panel — Project Report

---

**Project Title:** LMS Student Portal  
**Technology Stack:** React.js · Node.js · Express.js · MongoDB  
**Repository:** [Student-penal-lms](https://github.com/Prince8574/Student-penal-lms)  
**Author:** Prince  
**Version:** 1.0.0

---

</div>

## 1. Project Overview

The **LMS Student Panel** is a feature-rich web application that serves as the primary interface for students enrolled in the Learning Management System. It enables students to explore courses, track their learning progress, submit assignments, view grades, earn certificates, and engage with the learning community.

---

## 2. Objectives

- Provide students with an intuitive and engaging learning interface
- Enable seamless course discovery, enrollment, and payment
- Track assignment submissions and academic performance
- Generate and display certificates upon course completion
- Foster community engagement through posts and messaging
- Deliver a personalized profile and settings experience

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────┐
│                  CLIENT LAYER                   │
│         React.js + GSAP + Three.js              │
└────────────────────┬────────────────────────────┘
                     │ HTTP / REST API
┌────────────────────▼────────────────────────────┐
│                 SERVER LAYER                    │
│          Node.js + Express.js (Port 5001)       │
│  Auth · Courses · Assignments · Payments · Chat │
└────────────────────┬────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────┐
│               DATABASE LAYER                    │
│              MongoDB Atlas                      │
└─────────────────────────────────────────────────┘
```

---

## 4. Module Description

| # | Module | Description |
|---|--------|-------------|
| 1 | **Authentication** | Register, login, OTP verification, forgot password |
| 2 | **Home** | Landing page with featured courses, testimonials, and CTAs |
| 3 | **Explore** | Browse and filter all available courses by category |
| 4 | **My Courses** | View enrolled courses and track learning progress |
| 5 | **Assignments** | Submit assignments, view deadlines, and receive feedback |
| 6 | **Grades** | View performance charts, quiz scores, and grade history |
| 7 | **Certificates** | Download PDF certificates for completed courses |
| 8 | **Profile** | Edit personal info, avatar, stats heatmap, Pomodoro timer |
| 9 | **Community** | Create posts, reply to discussions, and send messages |
| 10 | **Notifications** | Real-time alerts for grades, deadlines, and announcements |
| 11 | **Settings** | Account, appearance, privacy, security, and learning preferences |

---

## 5. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React.js 18 | UI rendering and component management |
| Animation | GSAP | Smooth UI transitions and animations |
| 3D Graphics | Three.js | Background visual effects |
| Backend Runtime | Node.js | Server-side JavaScript execution |
| Web Framework | Express.js | REST API routing and middleware |
| Database | MongoDB Atlas | NoSQL cloud database |
| ODM | Mongoose | MongoDB object modeling |
| Authentication | JWT + bcryptjs | Secure token-based auth |
| File Upload | Multer | Profile photo and document uploads |
| Email Service | Nodemailer | OTP and notification emails |
| PDF Generation | PDFKit | Certificate PDF creation |

---

## 6. Project Structure

```
student-panel/
├── public/                        # Static assets
├── src/
│   ├── backend/                   # Node.js + Express server
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/           # Business logic handlers
│   │   ├── middleware/            # Auth & validation middleware
│   │   ├── models/                # Mongoose data models
│   │   ├── routes/                # API route definitions
│   │   ├── services/              # Certificate & email services
│   │   └── server.js              # Express app entry point
│   ├── frontend/                  # React pages & components
│   │   ├── Auth/                  # Login, register, OTP
│   │   ├── Home/                  # Landing page
│   │   ├── Explore/               # Course discovery
│   │   ├── MyCourses/             # Enrolled courses
│   │   ├── Assignments/           # Assignment portal
│   │   ├── Grades/                # Grades & certificates
│   │   ├── Profile/               # Student profile
│   │   ├── Community/             # Posts & messaging
│   │   ├── Notifications/         # Alerts & updates
│   │   └── Settings/              # User preferences
│   ├── components/                # Shared UI components
│   ├── context/                   # React context (Auth)
│   ├── services/                  # API service layer
│   └── App.js                     # Root component & routing
├── .gitignore
├── package.json
└── README.md
```

---

## 7. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Student login |
| GET | `/api/courses` | Get all available courses |
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/assignments` | Get student assignments |
| POST | `/api/assignments/:id/submit` | Submit assignment |
| GET | `/api/users/profile` | Get student profile |
| PUT | `/api/users/profile` | Update student profile |
| GET | `/api/grades` | Get student grades |

---

## 8. Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- npm or yarn

### Frontend Setup
```bash
cd student-panel
npm install
npm start
```

### Backend Setup
```bash
cd student-panel/src/backend
npm install
npm run dev
```

### Environment Configuration

Create `.env` file in `student-panel/src/backend/`:

```env
MONGO_URI        = your_mongodb_connection_string
JWT_SECRET       = your_jwt_secret_key
EMAIL_USER       = your_email@gmail.com
EMAIL_PASS       = your_app_password
PORT             = 5001
```

---

## 9. Database Models

| Model | Fields |
|-------|--------|
| **User** | name, email, password, avatar, enrolledCourses |
| **Course** | title, description, price, curriculum, instructor |
| **Enrollment** | studentId, courseId, progress, completedAt |
| **Assignment** | title, courseId, dueDate, submissions |
| **Submission** | studentId, assignmentId, fileUrl, grade, feedback |
| **Payment** | studentId, courseId, amount, status, date |
| **Post** | authorId, content, likes, comments |
| **Message** | senderId, receiverId, content, timestamp |

---

## 10. Security Measures

- All protected routes require valid JWT token
- Passwords hashed using bcryptjs (salt rounds: 10)
- OTP verification for new registrations
- Environment variables for all sensitive credentials
- CORS configured for allowed origins only
- Input validation on all API endpoints

---

<div align="center">

---

**LMS Student Panel** · Built with React & Node.js · © 2025 ❤️ Prince

</div>
