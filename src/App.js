import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './frontend/Home/Home';
import Auth from './frontend/Auth/Auth';
import Profile from './frontend/Profile/Profile';
import EditProfile from './frontend/Profile/EditProfile';
import Course from './frontend/Course/Course';
import Explore from './frontend/Explore/Explore';
import ExploreCategories from './frontend/Explore/components/ExploreCategories';
import MyCourses from './frontend/MyCourses/MyCourses';
import LearnModule from './frontend/Learn/LearnModule';
import Assignments from './frontend/Assignments/Assignments';
import AssignmentDetail from './frontend/Assignments/AssignmentDetail';
import Community from './frontend/Community/Community';
import GradesPage from './frontend/Grades/Grades';
import NotificationsPage from './frontend/Notifications/Notifications';
import SettingsPage from './frontend/Settings/Settings';
import EnrollPage from './frontend/Enroll/Enroll';
import TestAuth from './TestAuth';
import AIAssistant from './components/AIAssistant/AIAssistant';

// Logged in ho to home, nahi to login
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? <Navigate to="/" /> : children;
};

// Login nahi hai to login page pe bhejo
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/auth"      element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/login"     element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/register"  element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/assignments"  element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetail /></ProtectedRoute>} />
      <Route path="/community"    element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/grades"         element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
      <Route path="/notifications"  element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings"       element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/course/:id" element={<Course />} />
      <Route path="/learn/:courseId" element={<ProtectedRoute><LearnModule /></ProtectedRoute>} />
      <Route path="/explore"    element={<Explore />} />
      <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
      <Route path="/explore/categories" element={<ProtectedRoute><ExploreCategories /></ProtectedRoute>} />
      <Route path="/enroll/:courseId" element={<ProtectedRoute><EnrollPage /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <AIAssistantWrapper />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AIAssistantWrapper() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AIAssistant /> : null;
}

export default App;
