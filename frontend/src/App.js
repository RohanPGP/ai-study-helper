import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import StudyPackView from './pages/StudyPackView';
import './styles/global.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

        <Route path="/payment" element={
          <ProtectedRoute><Payment /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute requireSub><Upload /></ProtectedRoute>
        } />
        <Route path="/study-pack/:id" element={
          <ProtectedRoute><StudyPackView /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
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
