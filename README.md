<div align="center">

# 🎓 LearnVerse — Student Panel LMS

**A modern, full-stack Learning Management System built with React & Node.js**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## 📌 Overview

**LearnVerse** is a feature-rich Student Panel LMS (Learning Management System) that brings together course management, real-time community interaction, assignment tracking, grading, and more — all under one roof. Designed for students who want a seamless and engaging learning experience.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🏠 **Home** | Personalized dashboard with quick access to courses and activity |
| 🔐 **Authentication** | Secure signup/login with JWT-based session management |
| 📚 **My Courses** | Browse and manage enrolled courses |
| 🔍 **Explore** | Discover new courses and learning content |
| 📖 **Learn** | Interactive lesson viewer for enrolled courses |
| 📝 **Assignments** | Submit and track assignments |
| 📊 **Grades** | View grades and academic performance |
| 🤝 **Community** | Social feed with posts, comments, reactions, and direct messaging |
| 🔔 **Notifications** | Real-time alerts for course updates and interactions |
| 👤 **Profile** | View and edit student profile |
| ⚙️ **Settings** | Account preferences and configuration |
| 🎓 **Enroll** | Course enrollment flow |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **React Router v7** — Client-side routing
- **Axios** — HTTP requests
- **GSAP** — Animations
- **Three.js** — 3D visuals

### Backend
- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Authentication & authorization
- **bcryptjs** — Password hashing
- **Nodemailer** — Email notifications
- **PDFKit** — PDF generation
- **Multer** — File uploads

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Prince8574/Student-penal-lms.git
cd Student-penal-lms
```

### 2. Start the Backend

```bash
cd src/backend
npm install
```

Create a `.env` file in `src/backend/`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/learnverse
JWT_SECRET=your_jwt_secret_here
```

```bash
npm run dev
```

The API will be available at `http://localhost:5001`.

### 3. Start the Frontend

Open a new terminal in the project root:

```bash
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## 📡 API Overview

Base URL: `http://localhost:5001/api`

| Resource | Endpoints |
|----------|-----------|
| **Auth** | `POST /auth/register`, `POST /auth/login` |
| **Posts** | `GET/POST /posts`, like, react, bookmark, comment, reply |
| **Messages** | `GET/POST /messages/:userId`, user search |
| **Courses** | Course CRUD and enrollment |

> All protected routes require `Authorization: Bearer <token>` header.

For full API documentation, see [`COMMUNITY_BACKEND.md`](COMMUNITY_BACKEND.md).

---

## 📁 Project Structure

```
Student-penal-lms/
├── public/                  # Static assets
├── src/
│   ├── backend/             # Express API server
│   │   ├── config/          # DB & app config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   └── server.js        # App entry point
│   ├── components/          # Shared UI components (Sidebar, TopBar)
│   ├── context/             # React context providers
│   ├── frontend/            # Feature modules
│   │   ├── Auth/            # Login & Signup pages
│   │   ├── Home/            # Dashboard
│   │   ├── Course/          # Course viewer
│   │   ├── Community/       # Social feed & messaging
│   │   ├── Assignments/     # Assignment management
│   │   ├── Grades/          # Grade tracking
│   │   └── ...              # Other modules
│   ├── services/            # API service helpers
│   └── App.js               # Root component & routing
├── package.json
└── README.md
```

---

## 🧪 Running Tests

```bash
# Frontend tests
npm test

# Backend API health check
curl http://localhost:5001/api/health
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
Made with ❤️ for learners everywhere
</div>
