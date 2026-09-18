import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { api } from '../utils/api';

function Summary({ text }) {
  return (
    <div className="card">
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        📝 Summary
      </h2>
      <p style={{ lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-line' }}>{text}</p>
    </div>
  );
}

function KeyPoints({ points }) {
  return (
    <div className="card">
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>🔑 Key Points</h2>
      <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {points.map((kp, i) => (
          <li key={i} style={{ color: 'var(--gray-700)', lineHeight: 1.6, fontSize: 15 }}>{kp}</li>
        ))}
      </ol>
    </div>
  );
}

function Flashcards({ cards }) {
  const [flipped, setFlipped] = useState({});
  const toggle = (i) => setFlipped(f => ({ ...f, [i]: !f[i] }));

  return (
    <div className="card">
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>🃏 Flashcards</h2>
      <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 18 }}>Click a card to flip it</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {cards.map((fc, i) => (
          <div
            key={i}
            onClick={() => toggle(i)}
            style={{
              background: flipped[i] ? 'linear-gradient(135deg, var(--indigo-600), var(--violet-600))' : 'var(--gray-50)',
              border: '1.5px solid var(--gray-200)',
              borderRadius: 'var(--radius-lg)',
              padding: 20,
              cursor: 'pointer',
              minHeight: 110,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              transition: 'all 0.25s'
            }}
          >
            {flipped[i] ? (
              <>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 6 }}>ANSWER</p>
                <p style={{ color: '#fff', fontSize: 14, lineHeight: 1.5 }}>{fc.answer}</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 11, color: 'var(--indigo-500)', fontWeight: 700, marginBottom: 6 }}>QUESTION</p>
                <p style={{ color: 'var(--gray-900)', fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>{fc.question}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Quiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [retaking, setRetaking] = useState(false);

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  const missedQuestions = submitted
    ? questions.filter((q, i) => answers[i] !== q.correctIndex)
    : [];

  const pick = (qi, oi) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [qi]: oi }));
  };

  const optionStyle = (qi, oi) => {
    const base = {
      padding: '10px 14px', borderRadius: 'var(--radius)',
      cursor: submitted ? 'default' : 'pointer',
      marginBottom: 8, fontSize: 14, border: '1.5px solid transparent',
      transition: 'all 0.15s', display: 'block', textAlign: 'left', width: '100%',
      fontFamily: 'inherit'
    };
    if (!submitted) {
      return {
        ...base,
        background: answers[qi] === oi ? 'var(--indigo-50)' : 'var(--gray-50)',
        border: answers[qi] === oi ? '1.5px solid var(--indigo-500)' : '1.5px solid var(--gray-200)'
      };
    }
    if (oi === questions[qi].correctIndex) return { ...base, background: 'rgba(16,185,129,0.15)', border: '1.5px solid #10b981', color: '#34d399', fontWeight: 600 };
    if (answers[qi] === oi) return { ...base, background: 'rgba(239,68,68,0.15)', border: '1.5px solid #ef4444', color: '#f87171' };
    return { ...base, background: 'var(--gray-50)', border: '1.5px solid var(--gray-200)', color: 'var(--gray-400)' };
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>📋 Quiz ({questions.length} questions)</h2>
        {submitted && (
          <div style={{ fontWeight: 700, fontSize: 16, color: score >= questions.length * 0.7 ? 'var(--emerald-500)' : 'var(--amber-500)' }}>
            {score}/{questions.length} correct
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {questions.map((q, qi) => (
          <div key={qi}>
            <p style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
              {qi + 1}. {q.question}
            </p>
            {q.options.map((opt, oi) => (
              <button key={oi} style={optionStyle(qi, oi)} onClick={() => pick(qi, oi)}>
                <strong>{String.fromCharCode(65 + oi)}.</strong> {opt}
              </button>
            ))}
            {submitted && q.explanation && (
              <p style={{ fontSize: 13, color: 'var(--indigo-500)', background: 'var(--indigo-50)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          className="btn btn-primary"
          style={{ marginTop: 28, width: '100%' }}
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
        >
          Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      ) : (
        <>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 20, width: '100%' }}
            onClick={() => { setAnswers({}); setSubmitted(false); setRetaking(false); }}
          >
            Retake Quiz
          </button>

          {missedQuestions.length > 0 && !retaking && (
            <button
              className="btn btn-primary"
              style={{ marginTop: 10, width: '100%' }}
              onClick={() => setRetaking(true)}
            >
              Retake missed questions ({missedQuestions.length})
            </button>
          )}

          {retaking && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--gray-200)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Retake: missed questions</h3>
              <Quiz questions={missedQuestions} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function StudyPackView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [reprocessing, setReprocessing] = useState(false);
  const [shareToken, setShareToken] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getStudyPack(id)
      .then(({ pack }) => { setPack(pack); setShareToken(pack.shareToken || null); })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleReprocess = async () => {
    if (!window.confirm('Regenerate this study pack using AI? This will overwrite the current content.')) return;
    setReprocessing(true);
    try {
      await api.reprocess(id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setReprocessing(false);
    }
  };

  const enableShare = async () => {
    setShareLoading(true);
    try {
      const { shareToken } = await api.createShareLink(id);
      setShareToken(shareToken);
    } catch (err) {
      alert(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const disableShare = async () => {
    if (!window.confirm('Stop sharing this study pack? The link will stop working.')) return;
    setShareLoading(true);
    try {
      await api.revokeShareLink(id);
      setShareToken(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : null;

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = 180;
    let y = 20;

    const addWrapped = (text, fontSize = 11, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, pageWidth);
      lines.forEach(line => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += fontSize * 0.5;
      });
      y += 4;
    };

    addWrapped(pack.title, 18, true);
    addWrapped('Summary', 14, true);
    addWrapped(pack.summary || '');

    addWrapped('Key Points', 14, true);
    (pack.keyPoints || []).forEach((kp, i) => addWrapped(`${i + 1}. ${kp}`));

    addWrapped('Flashcards', 14, true);
    (pack.flashcards || []).forEach((fc, i) => {
      addWrapped(`Q${i + 1}: ${fc.question}`, 11, true);
      addWrapped(`A: ${fc.answer}`);
    });

    addWrapped('Quiz', 14, true);
    (pack.quiz || []).forEach((q, i) => {
      addWrapped(`${i + 1}. ${q.question}`, 11, true);
      q.options.forEach((opt, oi) => {
        const marker = oi === q.correctIndex ? ' (correct)' : '';
        addWrapped(`${String.fromCharCode(65 + oi)}. ${opt}${marker}`);
      });
    });

    doc.save(`${pack.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  };

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!pack) return null;

  const TABS = [
    { id: 'summary', label: '📝 Summary' },
    { id: 'keypoints', label: '🔑 Key Points' },
    { id: 'flashcards', label: `🃏 Flashcards (${pack.flashcards?.length || 0})` },
    { id: 'quiz', label: `📋 Quiz (${pack.quiz?.length || 0})` },
  ];

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              style={{ background: 'none', border: 'none', color: 'var(--indigo-500)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}
            >
              ← Dashboard
            </button>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{pack.title}</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
              {pack.subject && <>{pack.subject} · </>}
              {pack.flashcards?.length} flashcards · {pack.quiz?.length} quiz questions ·{' '}
              Uploaded {new Date(pack.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={shareToken ? disableShare : enableShare} disabled={shareLoading}>
              {shareLoading ? '…' : shareToken ? '🔗 Sharing' : '🔗 Share'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={downloadPdf}>⬇ PDF</button>
            <button className="btn btn-ghost btn-sm" onClick={handleReprocess} disabled={reprocessing}>
              {reprocessing ? '…' : '↺ Regenerate'}
            </button>
          </div>
        </div>

        {shareToken && (
          <div className="card" style={{ marginBottom: 20, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Public link:</span>
            <code style={{ fontSize: 13, color: 'var(--indigo-500)', flex: 1, minWidth: 200, wordBreak: 'break-all' }}>{shareUrl}</code>
            <button className="btn btn-ghost btn-sm" onClick={copyShareLink}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
        )}

        <div className="tabs" style={{ marginBottom: 20 }}>
          {TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'summary' && <Summary text={pack.summary} />}
        {activeTab === 'keypoints' && <KeyPoints points={pack.keyPoints || []} />}
        {activeTab === 'flashcards' && <Flashcards cards={pack.flashcards || []} />}
        {activeTab === 'quiz' && <Quiz questions={pack.quiz || []} />}
      </div>
    </div>
  );
}
