<div align="center">

# 🎓 LEARNING MANAGEMENT SYSTEM
## 👨‍🎓 Student Panel — Project Report

<br/>

![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![NodeJS](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

<br/>

![GSAP](https://img.shields.io/badge/Animation-GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Three.js](https://img.shields.io/badge/3D-Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![Google OAuth](https://img.shields.io/badge/OAuth-Google-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-0F9DCE?style=for-the-badge&logo=gmail&logoColor=white)
![PDFKit](https://img.shields.io/badge/PDF-PDFKit-FF0000?style=for-the-badge&logo=adobeacrobatreader&logoColor=white)
![Groq AI](https://img.shields.io/badge/AI-Groq-FF6B35?style=for-the-badge&logo=openai&logoColor=white)

<br/>

**Project Title:** LMS Student Portal &nbsp;|&nbsp; **Author:** Prince &nbsp;|&nbsp; **Version:** 1.0.0

---

</div>

## 📋 1. Project Overview

The **LMS Student Panel** is a feature-rich web application that serves as the primary interface for students enrolled in the Learning Management System. It enables students to explore courses, track their learning progress, submit assignments, view grades, earn certificates, and engage with the learning community.

---

## 🎯 2. Objectives

- ✅ Provide students with an intuitive and engaging learning interface
- ✅ Enable seamless course discovery, enrollment, and payment
- ✅ Track assignment submissions and academic performance
- ✅ Generate and display certificates upon course completion
- ✅ Foster community engagement through posts and messaging
- ✅ Google OAuth 2.0 Sign In / Auto-Register
- ✅ AI-powered learning assistant (Groq)
- ✅ Industry-level server & browser console logging

---

## 🏗️ 3. System Architecture

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
│         Google OAuth 2.0 · Passport.js          │
└────────────────────┬────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────▼────────────────────────────┐
│               DATABASE LAYER                    │
│              MongoDB Atlas                      │
└─────────────────────────────────────────────────┘
```

---

## 📦 4. Module Description

| # | 🔷 Module | 📝 Description |
|---|-----------|----------------|
| 1 | 🔐 **Authentication** | Register, login, OTP verification, Google OAuth 2.0 |
| 2 | 🏠 **Home** | Landing page with Three.js animation, GSAP scroll effects |
| 3 | 🔍 **Explore** | Browse and filter all available courses by category |
| 4 | 📚 **My Courses** | View enrolled courses and track learning progress |
| 5 | 📝 **Assignments** | Submit assignments, view deadlines, and receive feedback |
| 6 | 📊 **Grades** | View performance charts, quiz scores, and grade history |
| 7 | 🏅 **Certificates** | Download PDF certificates for completed courses |
| 8 | 👤 **Profile** | Edit personal info, avatar crop, stats heatmap, Pomodoro timer |
| 9 | 💬 **Community** | Create posts, reply to discussions, and send messages |
| 10 | 🔔 **Notifications** | Real-time alerts for grades, deadlines, and announcements |
| 11 | ⚙️ **Settings** | Account, appearance, privacy, security, and learning preferences |
| 12 | 🤖 **AI Assistant** | Groq-powered learning assistant |

---

## 🛠️ 5. Technology Stack

| Layer | 🔧 Technology | 🎯 Purpose |
|-------|--------------|-----------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat) | React.js 18 | UI rendering and component management |
| ![GSAP](https://img.shields.io/badge/-GSAP-88CE02?logo=greensock&logoColor=black&style=flat) | GSAP | Smooth UI transitions and scroll animations |
| ![Three.js](https://img.shields.io/badge/-Three.js-000000?logo=threedotjs&logoColor=white&style=flat) | Three.js | 3D hero & background visual effects |
| ![Node](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat) | Node.js | Server-side JavaScript execution |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat) | Express.js | REST API routing and middleware |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat) | MongoDB Atlas | NoSQL cloud database |
| ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat) | JWT + bcryptjs | Secure token-based auth |
| ![Google](https://img.shields.io/badge/-Google_OAuth-4285F4?logo=google&logoColor=white&style=flat) | Passport.js + Google OAuth 2.0 | Social login & auto-register |
| ![Multer](https://img.shields.io/badge/-Multer-FF6600?style=flat) | Multer | Profile photo and document uploads |
| ![Nodemailer](https://img.shields.io/badge/-Nodemailer-0F9DCE?logo=gmail&logoColor=white&style=flat) | Nodemailer | OTP and notification emails |
| ![PDFKit](https://img.shields.io/badge/-PDFKit-FF0000?logo=adobeacrobatreader&logoColor=white&style=flat) | PDFKit | Certificate PDF creation |
| ![Groq](https://img.shields.io/badge/-Groq_AI-FF6B35?logo=openai&logoColor=white&style=flat) | Groq API | AI learning assistant |

---

## 📁 6. Project Structure

```
student-panel/
├── 📂 public/                        # Static assets
│   └── 📄 manifest.json
├── 📂 src/
│   ├── 📂 backend/                   # Node.js + Express server
│   │   ├── 📂 config/
│   │   │   └── 📄 db.js              # MongoDB connection
│   │   ├── 📂 controllers/           # Business logic handlers
│   │   ├── 📂 middleware/            # Auth & validation middleware
│   │   ├── 📂 models/                # Mongoose data models
│   │   ├── 📂 routes/                # API route definitions
│   │   │   └── 📄 googleAuth.js      # Google OAuth routes
│   │   ├── 📂 services/              # Certificate & email services
│   │   └── 📄 server.js              # Express app entry point
│   ├── 📂 frontend/                  # React pages & components
│   │   ├── 📂 Auth/                  # Login, Register, OTP, GoogleCallback
│   │   ├── 📂 Home/                  # Landing page (Three.js + GSAP)
│   │   ├── 📂 Explore/               # Course discovery
│   │   ├── 📂 MyCourses/             # Enrolled courses
│   │   ├── 📂 Assignments/           # Assignment portal
│   │   ├── 📂 Grades/                # Grades & certificates
│   │   ├── 📂 Profile/               # Student profile
│   │   ├── 📂 Community/             # Posts & messaging
│   │   ├── 📂 Notifications/         # Alerts & updates
│   │   └── 📂 Settings/              # User preferences
│   ├── 📂 components/                # Shared UI components
│   ├── 📂 context/                   # React context (Auth)
│   ├── 📂 services/                  # API service layer (Axios)
│   ├── 📂 utils/                     # safeWebGL helper
│   └── 📄 App.js                     # Root component & routing
├── 📄 .gitignore
├── 📄 package.json
└── 📄 README.md
```

---

## 🌐 7. API Endpoints Summary

| Method | 🔗 Endpoint | 📋 Description |
|--------|------------|----------------|
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/register` | Student registration |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/login` | Student login |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/send-otp` | Send OTP to email |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/verify-otp` | Verify OTP |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/auth/google` | Google OAuth redirect |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/auth/google/callback` | Google OAuth callback |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/courses` | Get all available courses |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/enrollments/:courseId` | Enroll in a course |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/assignments` | Get student assignments |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/submissions/:id` | Submit assignment |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/users/profile` | Get student profile |
| ![PUT](https://img.shields.io/badge/PUT-FCA130?style=flat) | `/api/users/profile` | Update student profile |

---

## 🚀 8. Installation & Setup

### ✅ Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- Groq API key (for AI assistant)

### 💻 Frontend Setup
```bash
cd student-panel
npm install
npm start        # runs on http://localhost:3001
```

### 🖥️ Backend Setup
```bash
cd student-panel/src/backend
npm install
node server.js   # runs on http://localhost:5001
```

### 🔧 Environment Configuration

Create `.env` in `student-panel/src/backend/`:

```env
PORT                = 5001
MONGODB_URI         = your_mongodb_connection_string
JWT_SECRET          = your_jwt_secret_key
JWT_EXPIRE          = 7d
COOKIE_EXPIRE       = 7
CLIENT_URL          = http://localhost:3001
EMAIL_USER          = your_email@gmail.com
EMAIL_PASS          = your_app_password
GOOGLE_CLIENT_ID    = your_google_client_id
GOOGLE_CLIENT_SECRET= your_google_client_secret
GOOGLE_CALLBACK_URL = http://localhost:5001/api/auth/google/callback
GROQ_API_KEY        = your_groq_api_key
```

Create `.env` in `student-panel/`:
```env
PORT=3001
```

---

## 🔐 9. Auth Flow

```
Register  →  OTP Verify  →  Dashboard
Login     →  OTP Verify  →  Dashboard
Google    →  Auto Register / Login  →  Dashboard
```

---

## 🗄️ 10. Database Models

| 📊 Model | 🔑 Fields |
|---------|----------|
| 👤 **User** | name, email, password, avatar, googleId, enrolledCourses |
| 📚 **Course** | title, description, price, curriculum, instructor |
| 📋 **Enrollment** | studentId, courseId, progress, completedAt |
| 📝 **Assignment** | title, courseId, dueDate, submissions |
| 📤 **Submission** | studentId, assignmentId, fileUrl, grade, feedback |
| 💰 **Payment** | studentId, courseId, amount, status, date |
| 💬 **Post** | authorId, content, likes, comments |
| ✉️ **Message** | senderId, receiverId, content, timestamp |

---

## 🔒 11. Security Measures

- 🛡️ All protected routes require valid JWT token
- 🔑 Passwords hashed using bcryptjs (salt rounds: 10)
- 📧 OTP verification for new registrations (expires in 10 min)
- 🌍 Environment variables for all sensitive credentials
- 🚧 CORS configured for allowed origins only
- ✅ Input validation on all API endpoints
- 🔐 Google OAuth auto-creates accounts securely

---

<div align="center">

---

**🎓 LMS Student Panel** · Built with ❤️ using React & Node.js · © 2025 Prince

![GitHub](https://img.shields.io/badge/GitHub-Prince8574-181717?style=for-the-badge&logo=github&logoColor=white)

</div>
