import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={close}>
          <img src="/logo.svg" alt="" className="navbar-logo" />
          TutorPulseAI
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm" onClick={close}>Dashboard</Link>
              <Link to="/upload" className="btn btn-ghost btn-sm" onClick={close}>Upload</Link>
              <Link to="/tools" className="btn btn-ghost btn-sm" onClick={close}>Tools</Link>
              <Link to="/guide" className="btn btn-ghost btn-sm" onClick={close}>Guide</Link>
              <Link to="/settings" className="btn btn-ghost btn-sm" onClick={close}>Settings</Link>
            </>
          ) : (
            <>
              <Link to="/tools" className="btn btn-ghost btn-sm" onClick={close}>Tools</Link>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={close}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
