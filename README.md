# 🎓 LMS Student Panel

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

A modern **Learning Management System Student Portal** built with React, Node.js, Express, and MongoDB.

</div>

---

## ✨ Features

- 🔐 **Student Authentication** — Register, Login, OTP Verification
- 🏠 **Home Dashboard** — Explore courses, testimonials, featured content
- 📚 **Course Exploration** — Browse and filter all available courses
- 📖 **My Courses** — Track enrolled courses and progress
- 📝 **Assignments** — Submit assignments, view feedback and grades
- 🏅 **Grades & Certificates** — View performance charts and download certificates
- 👤 **Profile** — Edit profile, avatar, stats and heatmap
- 🔔 **Notifications** — Real-time updates
- 💬 **Community** — Posts, messages and discussions
- ⚙️ **Settings** — Account, appearance, privacy controls

---

## 🗂️ Project Structure

```
student-panel/
├── public/
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.js
│   ├── frontend/
│   │   ├── Home/
│   │   ├── Explore/
│   │   ├── MyCourses/
│   │   ├── Assignments/
│   │   ├── Grades/
│   │   ├── Profile/
│   │   ├── Community/
│   │   ├── Notifications/
│   │   ├── Settings/
│   │   └── Auth/
│   ├── components/
│   ├── context/
│   ├── services/
│   └── App.js
```

---

## 🚀 Getting Started

### Frontend

```bash
cd student-panel
npm install
npm start
```

### Backend

```bash
cd student-panel/src/backend
npm install
npm run dev
```

---

## 🔧 Environment Variables

Create a `.env` file in `src/backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=5001
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, GSAP, Three.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Email | Nodemailer |
| PDF | PDFKit |

---

<div align="center">
Made with ❤️ by Prince
</div>
