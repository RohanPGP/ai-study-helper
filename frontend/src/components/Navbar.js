import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.svg" alt="" className="navbar-logo" />
          TutorPulseAI
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
              <Link to="/upload" className="btn btn-ghost btn-sm">Upload</Link>
              <Link to="/tools" className="btn btn-ghost btn-sm">Tools</Link>
              <Link to="/guide" className="btn btn-ghost btn-sm">Guide</Link>
              <Link to="/settings" className="btn btn-ghost btn-sm">Settings</Link>
            </>
          ) : (
            <>
              <Link to="/tools" className="btn btn-ghost btn-sm">Tools</Link>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
