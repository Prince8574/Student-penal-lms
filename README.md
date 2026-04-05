<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=200&section=header&text=LearnVerse%20Student&fontSize=48&fontColor=ffffff&fontAlignY=38&desc=LMS%20Student%20Panel%20v1.0&descAlignY=58&descSize=18" width="100%"/>

# 🎓 LMS Student Panel — Project Report

<br/>

[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

<br/>

[![GSAP](https://img.shields.io/badge/Animation-GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com)
[![Three.js](https://img.shields.io/badge/3D-Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org)
[![Google OAuth](https://img.shields.io/badge/OAuth-Google-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://developers.google.com)
[![Groq AI](https://img.shields.io/badge/AI-Groq-FF6B35?style=for-the-badge&logo=openai&logoColor=white)](https://groq.com)

<br/>

> **Project Title:** LMS Student Portal &nbsp;|&nbsp; **Author:** Prince &nbsp;|&nbsp; **Version:** 1.0.0

<br/>

[![GitHub stars](https://img.shields.io/github/stars/Prince8574/LMS-Student?style=social)](https://github.com/Prince8574)
&nbsp;&nbsp;
[![GitHub last commit](https://img.shields.io/github/last-commit/Prince8574/LMS-Student?color=0ea5e9)](https://github.com/Prince8574)

</div>

---

## 📋 1. Project Overview

The **LearnVerse Student Panel** is a feature-rich, full-stack LMS portal built with React 18 + Node.js + MongoDB Atlas. It gives students a complete learning experience — from course discovery and enrollment to assignment submission, grade tracking, certificate generation, and AI-powered assistance.

```
🎯 One platform to learn · submit · track · grow · connect
```

---

## 🎯 2. Objectives

| # | Objective | Status |
|---|-----------|--------|
| 1 | Intuitive course discovery & enrollment interface | ✅ Done |
| 2 | Assignment submission & deadline tracking | ✅ Done |
| 3 | Grade history, performance charts & quiz scores | ✅ Done |
| 4 | PDF certificate generation on course completion | ✅ Done |
| 5 | Community posts, replies & messaging | ✅ Done |
| 6 | Google OAuth 2.0 + JWT + OTP authentication | ✅ Done |
| 7 | AI-powered learning assistant via Groq | ✅ Done |
| 8 | Profile management with avatar crop & stats heatmap | ✅ Done |

---

## 🏗️ 3. System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    CLIENT LAYER                      │
│          React 18 · GSAP · Three.js · CSS            │
│         localhost:3001  (Student Panel)              │
└─────────────────────┬────────────────────────────────┘
                      │  REST API  (HTTP/JSON)
┌─────────────────────▼────────────────────────────────┐
│                   SERVER LAYER                       │
│           Node.js + Express.js  :5001                │
│   Auth · Courses · Assignments · Payments · Chat     │
│        Google OAuth 2.0 · Passport.js · JWT          │
└─────────────────────┬────────────────────────────────┘
                      │  MongoDB Driver
┌─────────────────────▼────────────────────────────────┐
│                  DATABASE LAYER                      │
│               MongoDB Atlas (Cloud)                  │
│  users · courses · enrollments · submissions · posts │
└──────────────────────────────────────────────────────┘
```

---

## 📦 4. Module Description

| # | � Module | 📝 Description |
|---|-----------|----------------|
| 1 | 🔐 **Authentication** | JWT login, OTP email verify, Google OAuth 2.0 auto-register |
| 2 | 🏠 **Home** | Landing page with Three.js animation & GSAP scroll effects |
| 3 | � **Explore** | Browse and filter all available courses by category |
| 4 | 📚 **My Courses** | View enrolled courses and track learning progress |
| 5 | 📝 **Assignments** | Submit assignments, view deadlines, receive feedback |
| 6 | � **Grades** | Performance charts, quiz scores & grade history |
| 7 | � **Certificates** | Download PDF certificates for completed courses |
| 8 | 👤 **Profile** | Edit info, avatar crop, stats heatmap, Pomodoro timer |
| 9 | 💬 **Community** | Create posts, reply to discussions, send messages |
| 10 | 🔔 **Notifications** | Real-time alerts for grades, deadlines & announcements |
| 11 | ⚙️ **Settings** | Account, appearance, privacy, security & learning prefs |
| 12 | 🤖 **AI Assistant** | Groq-powered learning assistant |

---

## 🛠️ 5. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat) | React.js 18 | UI rendering & routing |
| ![GSAP](https://img.shields.io/badge/-GSAP-88CE02?logo=greensock&logoColor=black&style=flat) | GSAP 3 | Animations & transitions |
| ![Three.js](https://img.shields.io/badge/-Three.js-000000?logo=threedotjs&logoColor=white&style=flat) | Three.js | 3D hero & particle backgrounds |
| ![Node](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat) | Node.js | Server runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=flat) | Express.js | REST API framework |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat) | MongoDB Atlas | Cloud NoSQL database |
| ![JWT](https://img.shields.io/badge/-JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat) | JWT + bcryptjs | Token auth & password hashing |
| ![Google](https://img.shields.io/badge/-Google_OAuth-4285F4?logo=google&logoColor=white&style=flat) | Passport.js | Social login & auto-register |
| ![Multer](https://img.shields.io/badge/-Multer-FF6600?style=flat) | Multer | Profile photo & document uploads |
| ![Nodemailer](https://img.shields.io/badge/-Nodemailer-0F9DCE?logo=gmail&logoColor=white&style=flat) | Nodemailer | OTP & notification emails |
| ![PDFKit](https://img.shields.io/badge/-PDFKit-FF0000?logo=adobeacrobatreader&logoColor=white&style=flat) | PDFKit | Certificate PDF generation |
| ![Groq](https://img.shields.io/badge/-Groq_AI-FF6B35?logo=openai&logoColor=white&style=flat) | Groq API | AI learning assistant |

---

## � 6. Project Structure

```
student-panel/
├── 📂 public/
├── 📂 src/
│   ├── 📂 backend/                        # Node.js + Express API
│   │   ├── 📂 config/
│   │   │   └── 📄 db.js                   # MongoDB connection
│   │   ├── 📂 controllers/
│   │   │   ├── � authController.js       # Register, login, OTP, Google
│   │   │   ├── � assignmentController.js # Assignments & submissions
│   │   │   ├── � subm issionController.js # File upload & grading
│   │   │   └── 📄 postController.js       # Community posts & replies
│   │   ├── 📂 middleware/
│   │   │   └── � auth.js                 # JWT protect middleware
│   │   ├── 📂 models/
│   │   │   ├── 📄 User.js
│   │   │   ├── � Submission.js
│   │   │   └── 📄 (Course, Enrollment, Post, Payment)
│   │   ├── 📂 routes/
│   │   │   ├── 📄 assignments.js
│   │   │   ├── � assignmentRoutes.js
│   │   │   ├── 📄 users.js
│   │   │   ├── 📄 ai.js                   # Groq AI endpoint
│   │   │   └── � googleAuth.js           # Google OAuth routes
│   │   ├── 📂 services/
│   │   │   └── 📄 emailService.js
│   │   └── 📄 server.js
│   │
│   ├── 📂 frontend/
│   │   ├── 📂 Auth/                       # Login, Register, OTP, GoogleCallback
│   │   ├── 📂 Home/                       # Landing (Three.js + GSAP)
│   │   ├── 📂 Explore/                    # Course discovery & filters
│   │   ├── 📂 MyCourses/                  # Enrolled courses & progress
│   │   ├── 📂 Assignments/                # Submit, view feedback
│   │   ├── 📂 Grades/                     # Charts, quiz scores, certs
│   │   ├── 📂 Profile/                    # Avatar crop, heatmap, Pomodoro
│   │   ├── 📂 Community/                  # Posts & messaging
│   │   ├── 📂 Notifications/              # Alerts & updates
│   │   └── 📂 Settings/                   # User preferences
│   │
│   ├── 📂 components/
│   │   ├── 📄 Sidebar.js
│   │   ├── 📄 TopBar.js
│   │   └── 📂 AIAssistant/                # Groq chat widget
│   │
│   ├── 📂 context/
│   │   └── 📄 AuthContext.js
│   ├── 📂 services/
│   │   └── 📄 api.js                      # Axios API layer
│   ├── 📂 utils/
│   │   └── � safeWebGL.js
│   └── 📄 App.js                          # Root component & routing
│
├── 📄 .gitignore
├── 📄 package.json
└── 📄 README.md
```

---

## 🌐 7. API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/register` | Student registration |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/login` | Student login |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/send-otp` | Send OTP to email |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/auth/verify-otp` | Verify OTP |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/auth/google` | Google OAuth redirect |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/auth/google/callback` | Google OAuth callback |

### 📚 Courses & Enrollment
| Method | Endpoint | Description |
|--------|----------|-------------|
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/courses` | Get all available courses |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/enrollments/:courseId` | Enroll in a course |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/enrollments/my` | Get enrolled courses |

### 📝 Assignments & Submissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/assignments` | Get student assignments |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/submissions/:id` | Submit assignment |
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/submissions/my` | Get my submissions & grades |

### 👤 Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| ![GET](https://img.shields.io/badge/GET-61AFFE?style=flat) | `/api/users/profile` | Get student profile |
| ![PUT](https://img.shields.io/badge/PUT-FCA130?style=flat) | `/api/users/profile` | Update student profile |
| ![POST](https://img.shields.io/badge/POST-49CC90?style=flat) | `/api/users/avatar` | Upload avatar |

---

## � 8. Installation & Setup

### ✅ Prerequisites
```
Node.js v18+  ·  MongoDB Atlas account  ·  Google Cloud Console project  ·  Groq API key
```

### � Frontend
```bash
cd student-panel
npm install
npm start          # → http://localhost:3001
```

### �️ Backend
```bash
cd student-panel/src/backend
npm install
node server.js     # → http://localhost:5001
```

### � Environment Variables
Create `student-panel/src/backend/.env`:

```env
PORT                 = 5001
MONGODB_URI          = mongodb+srv://<user>:<pass>@cluster.mongodb.net/learnverse
JWT_SECRET           = your_jwt_secret_key
JWT_EXPIRE           = 7d
COOKIE_EXPIRE        = 7
CLIENT_URL           = http://localhost:3001
EMAIL_USER           = your_email@gmail.com
EMAIL_PASS           = your_app_password
GOOGLE_CLIENT_ID     = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
GOOGLE_CALLBACK_URL  = http://localhost:5001/api/auth/google/callback
GROQ_API_KEY         = your_groq_api_key
```

Create `student-panel/.env`:
```env
PORT=3001
```

---

## 🔐 9. Auth Flow

```
┌─────────────────────────────────────────────────────┐
│                   LOGIN OPTIONS                     │
├─────────────────────┬───────────────────────────────┤
│  📧 Email + Password│  → OTP Verify → Dashboard     │
│  🔵 Google Button   │  → OAuth 2.0  → Dashboard     │
└─────────────────────┴───────────────────────────────┘

Register  →  OTP Verify  →  Dashboard
Login     →  OTP Verify  →  Dashboard
Google    →  Auto Register / Login  →  Dashboard
```

> ⚠️ OTP expires in 10 minutes. Google OAuth auto-creates a student account on first login.

---

## 🗄️ 10. Database Models

| 📊 Model | 🔑 Key Fields |
|---------|--------------|
| 👤 **User** | name, email, password, avatar, googleId, enrolledCourses |
| 📚 **Course** | title, description, price, curriculum, instructor, isPublished |
| 📋 **Enrollment** | studentId, courseId, progress, completedAt |
| 📝 **Assignment** | title, courseId, dueDate, maxScore, createdBy |
| 📤 **Submission** | studentId, assignmentId, fileUrl, grade, feedback, status |
| 💰 **Payment** | studentId, courseId, amount, status, date |
| 💬 **Post** | authorId, content, likes, comments, createdAt |
| ✉️ **Message** | senderId, receiverId, content, timestamp |

---

## 🔒 11. Security Measures

```
🛡️  JWT middleware on all protected routes
🔑  bcryptjs password hashing (salt: 10)
📧  OTP verification for new registrations (expires 10 min)
🌍  All secrets in .env (never committed)
🚧  CORS restricted to allowed origins
✅  Input validation on all endpoints
🔐  Google OAuth auto-creates accounts securely
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=120&section=footer" width="100%"/>

**🎓 LearnVerse Student Panel v1.0** · Built with ❤️ using React & Node.js

[![GitHub](https://img.shields.io/badge/GitHub-Prince8574-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Prince8574)
&nbsp;
[![Version](https://img.shields.io/badge/Version-1.0.0-0ea5e9?style=for-the-badge)](https://github.com/Prince8574)

© 2026 Prince Kumar · LearnVerse Technologies

</div>
