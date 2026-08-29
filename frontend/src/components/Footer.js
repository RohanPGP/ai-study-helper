import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--gray-200)', padding: '24px 0', marginTop: 40 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
          © {new Date().getFullYear()} Rohan Sharma. All rights reserved.
        </p>
        <Link to="/about" style={{ fontSize: 13, color: 'var(--indigo-500)', fontWeight: 600 }}>About</Link>
      </div>
    </footer>
  );
}
