import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

const Feature = ({ icon, text }) => (
  <li style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', fontSize: 15, color: 'var(--gray-700)' }}>
    <span style={{ fontSize: 18 }}>{icon}</span> {text}
  </li>
);

export default function Payment() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentSuccess = searchParams.get('payment') === 'success';
  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    if (paymentSuccess) {
      // Poll until subscription is active (webhook may take a second)
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const u = await refreshUser();
        if (u.hasActiveSubscription || attempts >= 10) {
          clearInterval(poll);
          navigate('/dashboard', { replace: true });
        }
      }, 1500);
      return () => clearInterval(poll);
    }
  }, [paymentSuccess, navigate, refreshUser]);

  const handleSubscribe = async () => {
    setError('');
    setLoading(true);
    try {
      const { url } = await api.createCheckout();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="page">
        <div className="loading-center">
          <div style={{ fontSize: 48 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Payment successful!</h2>
          <p style={{ color: 'var(--gray-500)' }}>Activating your subscription…</p>
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 520 }}>
        {canceled && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>
            Payment was canceled. You can try again below.
          </div>
        )}

        <div className="card" style={{ marginTop: 20, textAlign: 'center' }}>
          {/* Price badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'baseline', gap: 4,
            background: 'linear-gradient(135deg, var(--indigo-600), var(--violet-600))',
            color: '#fff', borderRadius: 'var(--radius-xl)',
            padding: '16px 40px', marginBottom: 28
          }}>
            <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>$5</span>
            <span style={{ fontSize: 18, opacity: 0.85 }}>/month</span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            AI Study Helper Pro
          </h1>
          <p style={{ color: 'var(--gray-500)', marginBottom: 28 }}>
            Turn any homework into a complete study pack instantly
          </p>

          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 32 }}>
            <Feature icon="🤖" text="AI-powered summaries, key points, flashcards & quizzes" />
            <Feature icon="📄" text="Upload PDFs, Word docs, and text files" />
            <Feature icon="📧" text="Email your study packs for offline review" />
            <Feature icon="📚" text="Full history of all your study packs" />
            <Feature icon="♾️" text="Unlimited uploads and reprocessing" />
            <Feature icon="🔒" text="Cancel anytime — no lock-in" />
          </ul>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', fontSize: 17 }}
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Redirecting to Stripe…' : '🔒 Subscribe for $5/month'}
          </button>

          <p style={{ marginTop: 14, fontSize: 12, color: 'var(--gray-300)' }}>
            Secured by Stripe. Cancel any time from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
