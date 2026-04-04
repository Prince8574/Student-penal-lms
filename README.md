# LearnVerse — Student Panel

> AI-powered Learning Management System for students, built with React, Node.js, Express & MongoDB.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, GSAP, Three.js, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, OTP (Email), Google OAuth 2.0 |
| AI Assistant | Groq API |
| Email | Nodemailer (Gmail) |
| File Upload | Multer |

---

## Features

- Google OAuth 2.0 Sign In / Sign Up (auto-register)
- Email + OTP two-step login & registration
- Forgot / Reset password via OTP
- Course exploration & enrollment
- Assignment submission with file upload
- Grades & performance charts
- Certificate download (PDF)
- Community posts & messaging
- AI Assistant (Groq-powered)
- Profile with avatar crop & social links
- Notifications system
- Settings & preferences
- Industry-level server + browser console logs
- Three.js animated hero & background
- GSAP scroll animations

---

## Project Structure

```
student-panel/
├── public/
│   └── manifest.json
├── src/
│   ├── backend/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Auth, User, Assignment, Submission, Post
│   │   ├── middleware/      # JWT auth, role authorization
│   │   ├── models/          # User, Submission, Course, etc.
│   │   ├── routes/          # All API routes + Google OAuth
│   │   ├── services/        # Email, Certificate
│   │   └── server.js
│   ├── components/          # Sidebar, TopBar, AIAssistant
│   ├── context/             # AuthContext
│   ├── frontend/
│   │   ├── Auth/            # Login, Register, ForgotPassword, GoogleCallback
│   │   ├── Assignments/     # Assignment list, detail, submit
│   │   ├── Community/       # Posts & discussions
│   │   ├── Explore/         # Course discovery
│   │   ├── Grades/          # Grades, certificates, charts
│   │   ├── Home/            # Landing with Three.js + GSAP
│   │   ├── MyCourses/       # Enrolled courses
│   │   ├── Notifications/   # Notification center
│   │   ├── Profile/         # Profile & edit
│   │   └── Settings/        # User settings
│   ├── services/            # API service (axios)
│   ├── utils/               # safeWebGL helper
│   └── App.js
└── package.json
```

---

## Getting Started

### 1. Install dependencies

```bash
# Frontend
cd student-panel
npm install

# Backend
cd student-panel/src/backend
npm install
```

### 2. Configure environment

Create `student-panel/src/backend/.env`:

```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:3001
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
GROQ_API_KEY=your_groq_api_key
```

Create `student-panel/.env`:

```env
PORT=3001
```

### 3. Run

```bash
# Backend
cd student-panel/src/backend
node server.js

# Frontend (new terminal)
cd student-panel
npm start
```

Frontend: `http://localhost:3001`
Backend API: `http://localhost:5001/api`

---

## Auth Flow

```
Register → OTP verify → Dashboard
Login    → OTP verify → Dashboard
Google   → Auto register/login → Dashboard
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new student |
| POST | `/api/auth/login` | Login (credentials check) |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/forgot-password` | Send reset OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/courses` | Browse courses |
| GET | `/api/assignments` | Get assignments |
| POST | `/api/submissions/:id` | Submit assignment |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |

---

## Google OAuth Setup

See [GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md) for full setup guide.

Google Console redirect URIs needed:
```
http://localhost:5000/api/auth/google/callback
http://localhost:5001/api/auth/google/callback
```

---

## Environment Notes

- `.env` files are gitignored — never commit secrets
- OTP expires in 10 minutes
- Google OAuth auto-creates student accounts on first login
