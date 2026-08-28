import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children, requireSub = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requireSub && !user.hasActiveSubscription) {
    return <Navigate to="/payment" replace />;
  }

  return children;
}
