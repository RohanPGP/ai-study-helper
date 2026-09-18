import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

const Step = ({ icon, title, desc, className, style }) => (
  <div className={className} style={{ textAlign: 'center', flex: 1, minWidth: 200, ...style }}>
    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--indigo-600), var(--violet-600))', color: '#fff', fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{icon}</div>
    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
    <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const STEPS = [
  { icon: '📤', title: 'Upload your file', desc: 'PDF, Word doc, or plain text — we handle all formats up to 10 MB.' },
  { icon: '🤖', title: 'AI does the work', desc: 'AI reads and understands your material, then creates a complete study pack.' },
  { icon: '🎓', title: 'Study smarter', desc: 'Flip flashcards, take the quiz, review key points, and track your progress.' },
];

const FEATURES = [
  { icon: '📝', title: 'Smart Summary', desc: 'Multi-paragraph summaries covering all major topics from your material.' },
  { icon: '🔑', title: 'Key Points', desc: 'The most important takeaways extracted and prioritized for quick review.' },
  { icon: '🃏', title: 'Flashcards', desc: 'Interactive flip cards covering vocabulary and concepts — click to reveal.' },
  { icon: '📋', title: 'Adaptive Quiz', desc: 'Choose Easy, Medium, or Hard, then retake just the questions you missed.' },
  { icon: '🔗', title: 'Shareable Links', desc: 'Generate a public read-only link so classmates can view a study pack — no account needed.' },
  { icon: '⬇', title: 'PDF Export', desc: 'Download any study pack as a printable PDF, all sections included.' },
  { icon: '📚', title: 'Subjects & History', desc: 'Organize uploads by subject and filter your full study history anytime.' },
  { icon: '🧮', title: 'Study Tools', desc: 'Built-in grade calculator, GPA calculator, and MLA/APA citation generator.' },
];

export default function Home() {
  const [stepsRef, stepsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #100f1e 0%, #1a1030 100%)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge-animate" style={{ display: 'inline-block', background: 'var(--white)', border: '1px solid var(--indigo-200)', borderRadius: 999, padding: '5px 16px', fontSize: 13, fontWeight: 600, color: 'var(--indigo-500)', marginBottom: 24 }}>
            Made by Rohan Sharma
          </div>
          <h1 className="animate-in" style={{ animationDelay: '0.1s', fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20, color: 'var(--gray-900)' }}>
            Turn Homework Into<br />
            <span className="gradient-text-animated" style={{ background: 'linear-gradient(135deg, var(--indigo-500), var(--violet-500), var(--indigo-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Perfect Study Packs
            </span>
          </h1>
          <p className="animate-in" style={{ animationDelay: '0.2s', fontSize: 19, color: 'var(--gray-500)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Upload any PDF, Word doc, or text file. AI instantly generates summaries, key points, flashcards, and quizzes — ready to review in seconds.
          </p>
          <div className="animate-in" style={{ animationDelay: '0.3s', display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
          </div>
          <p className="animate-in" style={{ animationDelay: '0.4s', marginTop: 16, fontSize: 13, color: 'var(--gray-400)' }}>Free to use · No credit card required</p>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 0', background: 'var(--white)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 48 }}>How It Works</h2>
          <div ref={stepsRef} style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
            {STEPS.map((s, i) => (
              <Step
                key={s.title}
                {...s}
                className={`reveal ${stepsInView ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '72px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 40 }}>Everything You Need</h2>
          <div ref={featuresRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`card feature-card reveal ${featuresInView ? 'visible' : ''}`}
                style={{ padding: 24, transitionDelay: `${i * 80}ms` }}
              >
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
