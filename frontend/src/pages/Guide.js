export default function Guide() {
  const Section = ({ title, items }) => (
    <div className="card" style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.6 }}>
            <span style={{ color: 'var(--indigo-500)', flexShrink: 0 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: item }} />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Guide</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
          Everything TutorPulseAI can do, at a glance.
        </p>

        <Section title="🔑 Getting started" items={[
          'Sign up for a free account, or log in if you already have one.',
          'Check <strong>"Stay logged in for 15 days"</strong> at login to skip re-entering your password on that device.'
        ]} />

        <Section title="📤 Uploading homework" items={[
          'Go to <strong>Upload</strong> and drop in a PDF, Word doc, or text file (max 10 MB).',
          'Or use <strong>📷 Scan with camera</strong> to photograph physical pages instead.',
          'Optional: add a title and subject to keep things organized.',
          'Pick a quiz difficulty — Easy, Medium, or Hard.',
          'Takes about 30 seconds to generate.'
        ]} />

        <Section title="📚 Using a study pack" items={[
          '<strong>Summary</strong> — full written overview.',
          '<strong>Key Points</strong> — condensed takeaways.',
          '<strong>Flashcards</strong> — click to flip.',
          '<strong>Quiz</strong> — score + explanations after submitting.',
          'Missed a question? Hit <strong>"Retake missed questions"</strong> to redo just those.'
        ]} />

        <Section title="🔗 Sharing" items={[
          'Click <strong>🔗 Share</strong> on any study pack for a public, read-only link.',
          'Anyone with the link can view it and take the quiz — no account needed.',
          'Click it again anytime to disable the link.'
        ]} />

        <Section title="⬇ Exporting" items={[
          'Click <strong>⬇ PDF</strong> to download the full study pack — summary, key points, flashcards, and quiz with answers marked.'
        ]} />

        <Section title="🗂 Organizing" items={[
          'Tag uploads with a subject (e.g. "Math", "History").',
          'Filter your Dashboard by subject using the pills above your study pack list.',
          'Click <strong>↺ Regenerate</strong> on any pack to have the AI redo it from scratch.'
        ]} />

        <Section title="🧮 Tools" items={[
          '<strong>Grade calculator</strong> — find your current grade, or what you need on a final.',
          '<strong>GPA calculator</strong> — enter course type (AP/KAP/ACA), grade, and credits.',
          '<strong>Citations</strong> — generate MLA or APA website citations.'
        ]} />

        <Section title="⚙ Settings" items={[
          'Switch between light and dark theme.',
          'Set a default quiz difficulty for uploads.',
          'Update your display name or password.',
          'Logout lives here too, at the bottom.'
        ]} />
      </div>
    </div>
  );
}
