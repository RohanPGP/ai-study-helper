import { useState } from 'react';

function GradeCalculator() {
  const [rows, setRows] = useState([
    { name: '', grade: '', weight: '' },
    { name: '', grade: '', weight: '' },
    { name: '', grade: '', weight: '' }
  ]);
  const [currentGrade, setCurrentGrade] = useState(null);

  const [goalGrade, setGoalGrade] = useState('');
  const [finalCurrent, setFinalCurrent] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [finalResult, setFinalResult] = useState(null);

  const updateRow = (i, field, value) => {
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(rs => [...rs, { name: '', grade: '', weight: '' }]);

  const calculateGrade = () => {
    let weightedSum = 0, weightTotal = 0;
    rows.forEach(r => {
      const g = parseFloat(r.grade), w = parseFloat(r.weight);
      if (!isNaN(g) && !isNaN(w) && w > 0) {
        weightedSum += g * w;
        weightTotal += w;
      }
    });
    if (weightTotal === 0) { setCurrentGrade('no-data'); return; }
    const result = weightedSum / weightTotal;
    setCurrentGrade(result);
    setFinalCurrent(result.toFixed(1));
  };

  const calculateFinal = () => {
    const cur = parseFloat(finalCurrent);
    const goal = parseFloat(goalGrade);
    const w = parseFloat(finalWeight);
    if (isNaN(cur) || isNaN(goal) || isNaN(w) || w <= 0 || w > 100) {
      setFinalResult('invalid');
      return;
    }
    const needed = (goal - cur * (1 - w / 100)) / (w / 100);
    setFinalResult(needed);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="card">
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Grade calculator</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 18 }}>
          Enter each assignment's grade and weight to find your current overall grade.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', padding: '0 2px' }}>
            <span style={{ flex: 3 }}>Assignment (optional)</span>
            <span style={{ flex: 1 }}>Grade</span>
            <span style={{ flex: 1 }}>Weight %</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input className="input" style={{ flex: 3, minWidth: 140 }} placeholder="e.g. Homework 1" value={r.name} onChange={e => updateRow(i, 'name', e.target.value)} />
              <input className="input" style={{ flex: 1, minWidth: 70 }} type="number" placeholder="91" value={r.grade} onChange={e => updateRow(i, 'grade', e.target.value)} />
              <input className="input" style={{ flex: 1, minWidth: 70 }} type="number" placeholder="10" value={r.weight} onChange={e => updateRow(i, 'weight', e.target.value)} />
            </div>
          ))}
        </div>

        <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={addRow}>+ Add row</button>

        <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={calculateGrade}>
          Calculate current grade
        </button>

        {currentGrade === 'no-data' && (
          <div className="alert alert-error" style={{ marginTop: 16 }}>Enter at least one grade and weight.</div>
        )}
        {typeof currentGrade === 'number' && (
          <div className="alert alert-success" style={{ marginTop: 16 }}>
            Your current grade is <strong>{currentGrade.toFixed(1)}%</strong>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>What do I need on the final?</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 18 }}>
          Figure out the score you need on a final exam or remaining work to hit your goal.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="label">Your current grade (%)</label>
            <input className="input" type="number" value={finalCurrent} onChange={e => setFinalCurrent(e.target.value)} placeholder="e.g. 88" />
          </div>
          <div className="form-group">
            <label className="label">The grade you want (%)</label>
            <input className="input" type="number" value={goalGrade} onChange={e => setGoalGrade(e.target.value)} placeholder="e.g. 90" />
          </div>
          <div className="form-group">
            <label className="label">The final is worth (%)</label>
            <input className="input" type="number" value={finalWeight} onChange={e => setFinalWeight(e.target.value)} placeholder="e.g. 20" />
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={calculateFinal}>
          Calculate
        </button>

        {finalResult === 'invalid' && (
          <div className="alert alert-error" style={{ marginTop: 16 }}>Please fill in all three fields with valid numbers (weight between 1 and 100).</div>
        )}
        {typeof finalResult === 'number' && finalResult > 100 && (
          <div className="alert alert-error" style={{ marginTop: 16 }}>
            Even a perfect 100% on the final won't be enough to reach that goal.
          </div>
        )}
        {typeof finalResult === 'number' && finalResult <= 0 && (
          <div className="alert alert-success" style={{ marginTop: 16 }}>
            You've already secured that grade — any score on the final works!
          </div>
        )}
        {typeof finalResult === 'number' && finalResult > 0 && finalResult <= 100 && (
          <div className="alert alert-success" style={{ marginTop: 16 }}>
            You need a <strong>{finalResult.toFixed(1)}%</strong> or higher on the final.
          </div>
        )}
      </div>
    </div>
  );
}

function gradeToBasePoints(gradeNum) {
  const g = Math.round(gradeNum);
  if (g >= 93) return 4.0;
  if (g >= 90) return 3.7;
  if (g >= 87) return 3.3;
  if (g >= 83) return 3.0;
  if (g >= 80) return 2.7;
  if (g >= 77) return 2.3;
  if (g >= 73) return 2.0;
  if (g >= 70) return 1.7;
  if (g >= 67) return 1.3;
  if (g >= 63) return 1.0;
  if (g >= 60) return 0.7;
  return 0.0;
}

const TYPE_BONUS = { AP: 1.0, KAP: 1.0, ACA: 0.0 };

function GpaCalculator() {
  const [rows, setRows] = useState([
    { name: '', type: '', grade: '', credits: '' },
    { name: '', type: '', grade: '', credits: '' },
    { name: '', type: '', grade: '', credits: '' }
  ]);
  const [gpa, setGpa] = useState(null);

  const updateRow = (i, field, value) => {
    setRows(rs => rs.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(rs => [...rs, { name: '', type: '', grade: '', credits: '' }]);

  const calculate = () => {
    let points = 0, credits = 0;
    rows.forEach(r => {
      const grade = parseFloat(r.grade);
      const c = parseFloat(r.credits);
      if (r.type && TYPE_BONUS[r.type] !== undefined && !isNaN(grade) && !isNaN(c) && c > 0) {
        const p = gradeToBasePoints(grade) + TYPE_BONUS[r.type];
        points += p * c;
        credits += c;
      }
    });
    if (credits === 0) { setGpa('no-data'); return; }
    setGpa(points / credits);
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>GPA calculator</h2>
      <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 18 }}>
        Enter each course's type, grade (0-100), and credit hours. AP and KAP courses are weighted
        on a 5.0 scale; ACA courses use the standard 4.0 scale.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10, fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', padding: '0 2px' }}>
          <span style={{ flex: 3 }}>Course (optional)</span>
          <span style={{ flex: 1 }}>Type</span>
          <span style={{ flex: 1 }}>Grade</span>
          <span style={{ flex: 1 }}>Credits</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input className="input" style={{ flex: 3, minWidth: 140 }} placeholder="e.g. Algebra II" value={r.name} onChange={e => updateRow(i, 'name', e.target.value)} />
            <select className="input" style={{ flex: 1, minWidth: 80 }} value={r.type} onChange={e => updateRow(i, 'type', e.target.value)}>
              <option value="">Type</option>
              <option value="AP">AP</option>
              <option value="KAP">KAP</option>
              <option value="ACA">ACA</option>
            </select>
            <input className="input" style={{ flex: 1, minWidth: 70 }} type="number" placeholder="95" value={r.grade} onChange={e => updateRow(i, 'grade', e.target.value)} />
            <input className="input" style={{ flex: 1, minWidth: 70 }} type="number" placeholder="3" value={r.credits} onChange={e => updateRow(i, 'credits', e.target.value)} />
          </div>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={addRow}>+ Add row</button>

      <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={calculate}>
        Calculate GPA
      </button>

      {gpa === 'no-data' && (
        <div className="alert alert-error" style={{ marginTop: 16 }}>Enter at least one row with a type, grade, and credit value.</div>
      )}
      {typeof gpa === 'number' && (
        <div className="alert alert-success" style={{ marginTop: 16 }}>
          Your GPA is <strong>{gpa.toFixed(2)}</strong>
        </div>
      )}
    </div>
  );
}

const MLA_MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
const APA_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatMLADate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return '';
  return `${d.getDate()} ${MLA_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatAPADate(dateStr) {
  if (!dateStr) return 'n.d.';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d)) return 'n.d.';
  return `${d.getFullYear()}, ${APA_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function formatMLA({ authorLast, authorFirst, pageTitle, siteName, url, pubDate }) {
  const authorPart = authorLast ? `${authorLast}${authorFirst ? ', ' + authorFirst : ''}. ` : '';
  const dateStr = formatMLADate(pubDate);
  const datePart = dateStr ? `${dateStr}, ` : '';
  return `${authorPart}"${pageTitle}." ${siteName}, ${datePart}${url}.`;
}

function formatAPA({ authorLast, authorFirst, pageTitle, siteName, url, pubDate }) {
  const authorPart = authorLast ? `${authorLast}, ${authorFirst ? authorFirst.charAt(0) + '.' : ''} ` : '';
  const dateStr = formatAPADate(pubDate);
  if (authorLast) {
    return `${authorPart}(${dateStr}). ${pageTitle}. ${siteName}. ${url}`;
  }
  return `${pageTitle}. (${dateStr}). ${siteName}. ${url}`;
}

function CitationGenerator() {
  const [style, setStyle] = useState('MLA');
  const [authorLast, setAuthorLast] = useState('');
  const [authorFirst, setAuthorFirst] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [siteName, setSiteName] = useState('');
  const [url, setUrl] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [citation, setCitation] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!pageTitle || !siteName || !url) {
      setCitation('Please fill in at least the page title, site name, and URL.');
      return;
    }
    const result = style === 'MLA'
      ? formatMLA({ authorLast, authorFirst, pageTitle, siteName, url, pubDate })
      : formatAPA({ authorLast, authorFirst, pageTitle, siteName, url, pubDate });
    setCitation(result);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBtn = (active) => ({
    padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
    border: active ? 'none' : '1.5px solid var(--gray-200)',
    background: active ? 'var(--indigo-600)' : 'transparent',
    color: active ? '#fff' : 'var(--gray-500)',
    cursor: 'pointer'
  });

  return (
    <div className="card">
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Citation generator</h2>
      <p style={{ color: 'var(--gray-500)', fontSize: 13, marginBottom: 18 }}>
        Generate a website citation in MLA or APA format.
      </p>

      <div style={{ marginBottom: 18 }}>
        <label className="label">Style</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={toggleBtn(style === 'MLA')} onClick={() => setStyle('MLA')}>MLA</button>
          <button style={toggleBtn(style === 'APA')} onClick={() => setStyle('APA')}>APA</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Author last name (optional)</label>
            <input className="input" value={authorLast} onChange={e => setAuthorLast(e.target.value)} placeholder="Smith" />
          </div>
          <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
            <label className="label">Author first name (optional)</label>
            <input className="input" value={authorFirst} onChange={e => setAuthorFirst(e.target.value)} placeholder="Jane" />
          </div>
        </div>

        <div className="form-group">
          <label className="label">Page title</label>
          <input className="input" value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder="e.g. Photosynthesis Explained" />
        </div>

        <div className="form-group">
          <label className="label">Website / publisher name</label>
          <input className="input" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="e.g. Khan Academy" />
        </div>

        <div className="form-group">
          <label className="label">URL</label>
          <input className="input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label className="label">Publish date (optional)</label>
          <input className="input" type="date" value={pubDate} onChange={e => setPubDate(e.target.value)} />
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: 18, width: '100%' }} onClick={generate}>
        Generate citation
      </button>

      {citation && (
        <div className="card" style={{ marginTop: 16, background: 'var(--gray-50)' }}>
          <p style={{ fontSize: 14, color: 'var(--gray-900)', lineHeight: 1.6 }}>{citation}</p>
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  const [activeTab, setActiveTab] = useState('grade');

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>Tools</h1>

        <div className="tabs" style={{ marginBottom: 20 }}>
          <button className={`tab ${activeTab === 'grade' ? 'active' : ''}`} onClick={() => setActiveTab('grade')}>Grade calculator</button>
          <button className={`tab ${activeTab === 'gpa' ? 'active' : ''}`} onClick={() => setActiveTab('gpa')}>GPA calculator</button>
          <button className={`tab ${activeTab === 'citation' ? 'active' : ''}`} onClick={() => setActiveTab('citation')}>Citations</button>
        </div>

        {activeTab === 'grade' && <GradeCalculator />}
        {activeTab === 'gpa' && <GpaCalculator />}
        {activeTab === 'citation' && <CitationGenerator />}
      </div>
    </div>
  );
}
