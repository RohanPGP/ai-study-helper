$ cat << 'ENDOFFILE'
import { Link } from 'react-router-dom';

const Step = ({ n, icon, title, desc }) => (
  <div style={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo-600), var(--violet-600))', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{icon}</div>
    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
    <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
  </div>
);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #100f1e 0%, #1a1030 100%)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'var(--white)', border: '1px solid var(--indigo-200)', borderRadius: 999, padding: '5px 16px', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)', marginBottom: 24 }}>
            Made By Rohan Sharma
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: 'var(--gray-900)' }}>
            Turn Homework Into<br />
            <span style={{ background: 'linear-gradient(135deg, var(--indigo-500), var(--violet-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Perfect Study Packs
            </span>
          </h1>
          <p style={{ fontSize: 19, color: 'var(--gray-500)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Upload any PDF, Word doc, or text file. AI instantly generates summaries, key points, flashcards, and quizzes — ready to review in seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-400)' }}>Free to use · No credit card required</p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 0', background: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Step n={1} icon="📤" title="Upload your file" desc="PDF, Word doc, or plain text — we handle all formats up to 10 MB." />
            <Step n={2} icon="🤖" title="AI does the work" desc="AI reads and understands your material, then creates a complete study pack." />
            <Step n={3} icon="🎓" title="Study smarter" desc="Flip flashcards, take the quiz, review key points, and email yourself the pack." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Everything You Need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '📝', title: 'Smart Summary', desc: 'Multi-paragraph summaries covering all major topics from your material.' },
              { icon: '🔑', title: 'Key Points', desc: '8 essential takeaways extracted and prioritized for quick review.' },
              { icon: '🃏', title: 'Flashcards', desc: '10 interactive flip cards covering vocabulary and concepts — click to reveal.' },
              { icon: '📋', title: 'Auto Quiz', desc: '8 multiple-choice questions with explanations and instant scoring.' },
              { icon: '📧', title: 'Email Delivery', desc: 'Send the full study pack to any email for offline study.' },
              { icon: '📚', title: 'Study History', desc: 'All your packs saved and organized. Reprocess anytime.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
ENDOFFILE

import { Link } from 'react-router-dom';

const Step = ({ n, icon, title, desc }) => (
  <div style={{ textAlign: 'center', flex: 1, minWidth: 200 }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo-600), var(--violet-600))', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{icon}</div>
    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
    <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
  </div>
);

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #100f1e 0%, #1a1030 100%)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'var(--white)', border: '1px solid var(--indigo-200)', borderRadius: 999, padding: '5px 16px', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)', marginBottom: 24 }}>
            🤖 Powered by AI
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: 'var(--gray-900)' }}>
            Turn Homework Into<br />
            <span style={{ background: 'linear-gradient(135deg, var(--indigo-500), var(--violet-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Perfect Study Packs
            </span>
          </h1>
          <p style={{ fontSize: 19, color: 'var(--gray-500)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Upload any PDF, Word doc, or text file. AI instantly generates summaries, key points, flashcards, and quizzes — ready to review in seconds.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-400)' }}>Free to use · No credit card required</p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 0', background: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Step n={1} icon="📤" title="Upload your file" desc="PDF, Word doc, or plain text — we handle all formats up to 10 MB." />
            <Step n={2} icon="🤖" title="AI does the work" desc="AI reads and understands your material, then creates a complete study pack." />
            <Step n={3} icon="🎓" title="Study smarter" desc="Flip flashcards, take the quiz, review key points, and email yourself the pack." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Everything You Need</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '📝', title: 'Smart Summary', desc: 'Multi-paragraph summaries covering all major topics from your material.' },
              { icon: '🔑', title: 'Key Points', desc: '8 essential takeaways extracted and prioritized for quick review.' },
              { icon: '🃏', title: 'Flashcards', desc: '10 interactive flip cards covering vocabulary and concepts — click to reveal.' },
              { icon: '📋', title: 'Auto Quiz', desc: '8 multiple-choice questions with explanations and instant scoring.' },
              { icon: '📧', title: 'Email Delivery', desc: 'Send the full study pack to any email for offline study.' },
              { icon: '📚', title: 'Study History', desc: 'All your packs saved and organized. Reprocess anytime.' },
            ].map(f => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--gray-500)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
