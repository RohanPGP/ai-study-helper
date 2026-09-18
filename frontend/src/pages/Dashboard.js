import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

const statusBadge = (status) => ({
  ready:      <span className="badge badge-ready">✓ Ready</span>,
  processing: <span className="badge badge-processing">⏳ Processing</span>,
  error:      <span className="badge badge-error">✗ Error</span>
}[status] || null);

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [subjectFilter, setSubjectFilter] = useState('All');

  const loadPacks = useCallback(async () => {
    try {
      const { packs } = await api.history();
      setPacks(packs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPacks(); }, [loadPacks]);

  useEffect(() => {
    const processing = packs.filter(p => p.status === 'processing');
    if (processing.length === 0) return;
    const timer = setInterval(loadPacks, 4000);
    return () => clearInterval(timer);
  }, [packs, loadPacks]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study pack?')) return;
    setDeleting(id);
    try {
      await api.deleteStudyPack(id);
      setPacks(ps => ps.filter(p => p._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const subjects = ['All', ...Array.from(new Set(packs.map(p => p.subject).filter(Boolean)))];
  const filteredPacks = subjectFilter === 'All' ? packs : packs.filter(p => p.subject === subjectFilter);

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/upload" className="btn btn-primary">+ Upload Homework</Link>
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Study Packs</h2>

        {subjects.length > 1 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {subjects.map(s => (
              <button
                key={s}
                onClick={() => setSubjectFilter(s)}
                className={`btn btn-sm ${subjectFilter === s ? 'btn-primary' : 'btn-ghost'}`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : packs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--gray-500)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No study packs yet.</p>
            <Link to="/upload" className="btn btn-primary" style={{ marginTop: 16 }}>
              Upload your first file
            </Link>
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60, color: 'var(--gray-500)' }}>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No study packs in "{subjectFilter}" yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredPacks.map(pack => (
              <div key={pack._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{pack.title}</h3>
                    {statusBadge(pack.status)}
                    {pack.subject && <span className="badge badge-inactive">{pack.subject}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    {pack.flashcards?.length || 0} flashcards · {pack.quiz?.length || 0} quiz questions ·{' '}
                    {new Date(pack.createdAt).toLocaleDateString()}
                    {pack.emailSent && <span style={{ marginLeft: 8, color: 'var(--emerald-500)' }}>✉ Emailed</span>}
                  </p>
                  {pack.status === 'error' && (
                    <p style={{ fontSize: 12, color: 'var(--red-500)', marginTop: 4 }}>{pack.errorMessage}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {pack.status === 'ready' && (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/study-pack/${pack._id}`)}
                    >
                      Open →
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(pack._id)}
                    disabled={deleting === pack._id}
                  >
                    {deleting === pack._id ? '…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
