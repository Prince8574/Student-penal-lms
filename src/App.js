import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './frontend/Home/Home';
import Auth from './frontend/Auth/Auth';
import Profile from './frontend/Profile/Profile';
import EditProfile from './frontend/Profile/EditProfile';
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
import GoogleCallback from './frontend/Auth/GoogleCallback';
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
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user?.status === 'suspended' || user?.suspended) return <SuspendedScreen />;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function SuspendedScreen() {
  const { logout, user } = useAuth();
  return (
    <div style={{ minHeight: '100vh', background: '#050814', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px', maxWidth: 440, background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 20 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚫</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: 10 }}>Account Suspended</div>
        <div style={{ fontSize: '.9rem', color: '#94a3b8', marginBottom: user?.suspendReason ? 16 : 24, lineHeight: 1.6 }}>
          Your account has been suspended by the admin.
        </div>
        {user?.suspendReason && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, textAlign: 'left' }}>
            <div style={{ fontSize: '.72rem', color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>REASON</div>
            <div style={{ fontSize: '.85rem', color: '#cbd5e1' }}>{user.suspendReason}</div>
          </div>
        )}
        <div style={{ fontSize: '.8rem', color: '#64748b', marginBottom: 20 }}>Please contact support for assistance.</div>
        <button onClick={logout} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '.9rem' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/auth"      element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/login"     element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/register"  element={<AuthRoute><Auth /></AuthRoute>} />
      <Route path="/auth/google-callback" element={<GoogleCallback />} />
      <Route path="/test-auth" element={<TestAuth />} />
      <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/assignments"  element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
      <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetail /></ProtectedRoute>} />
      <Route path="/community"    element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/grades"         element={<ProtectedRoute><GradesPage /></ProtectedRoute>} />
      <Route path="/notifications"  element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="/settings"       element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
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
  const location = useLocation();
  const hideOnAssignments = location.pathname.startsWith('/assignments');
  return isAuthenticated && !hideOnAssignments ? <AIAssistant /> : null;
}

export default App;
