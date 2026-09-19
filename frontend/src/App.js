import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import CameraCapture from './pages/CameraCapture';
import StudyPackView from './pages/StudyPackView';
import About from './pages/About';
import Tools from './pages/Tools';
import SharedStudyPack from './pages/SharedStudyPack';
import Settings from './pages/Settings';
import Guide from './pages/Guide';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import './styles/global.css';

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/share/:token" element={<SharedStudyPack />} />

        <Route path="/payment" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />
        <Route path="/camera" element={
          <ProtectedRoute><CameraCapture /></ProtectedRoute>
        } />
        <Route path="/study-pack/:id" element={
          <ProtectedRoute><StudyPackView /></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />
        <Route path="/guide" element={
          <ProtectedRoute><Guide /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
