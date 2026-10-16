import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer style={{ borderTop: '1px solid var(--gray-200)', padding: '24px 0', marginTop: 40 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          © {new Date().getFullYear()} Rohan Sharma. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to={user ? '/dashboard' : '/'} style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Home</Link>
          <Link to="/about" style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>About</Link>
          <Link to="/terms" style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Terms</Link>
          <Link to="/privacy" style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Privacy</Link>
          <a href="mailto:rohanpgp@gmail.com" style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
