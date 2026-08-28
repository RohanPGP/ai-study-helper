import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand">
          📚 AI Study Helper
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <Link to="/upload" className="btn btn-ghost btn-sm">Upload</Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
