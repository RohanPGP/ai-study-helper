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

  // Poll for processing packs
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

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/upload" className="btn btn-primary">+ Upload Homework</Link>
          </div>
        </div>

        {/* Study packs */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Your Study Packs</h2>

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
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {packs.map(pack => (
              <div key={pack._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{pack.title}</h3>
                    {statusBadge(pack.status)}
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
