export default function Guide() {
  const Section = ({ title, children }) => (
    <div className="card" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
      <div style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: 15 }}>{children}</div>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Guide</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>
          Everything TutorPulseAI can do and how to get the most out of it.
        </p>

        <Section title="1. Getting started">
          <p>Create a free account from the Sign Up page, or log in if you already have one. Check
          "Stay logged in on this device for 15 days" at login if you don't want to sign in again
          every time you visit from the same device.</p>
        </Section>

        <Section title="2. Uploading homework">
          <p>Go to <strong>Upload</strong> and drop in a PDF, Word doc, or text file (up to 10 MB).
          You can optionally give it a custom title and a subject (e.g. "Biology") to keep things
          organized, and choose a quiz difficulty — Easy, Medium, or Hard — before generating. AI
          takes about 30 seconds to build your study pack.</p>
        </Section>

        <Section title="3. Using a study pack">
          <p>Every study pack has four tabs:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Summary</strong> — a full written overview of the material.</li>
            <li><strong>Key Points</strong> — the most important takeaways, condensed.</li>
            <li><strong>Flashcards</strong> — click any card to flip between question and answer.</li>
            <li><strong>Quiz</strong> — answer every question, then submit to see your score and
            explanations. If you miss any, a "Retake missed questions" button lets you redo just
            those instead of the whole quiz.</li>
          </ul>
        </Section>

        <Section title="4. Sharing a study pack">
          <p>Click <strong>🔗 Share</strong> on any study pack to generate a public read-only link
          — anyone with the link can view it and take the quiz without needing an account. Click
          the button again to stop sharing at any time, which immediately disables the link.</p>
        </Section>

        <Section title="5. Exporting to PDF">
          <p>Click <strong>⬇ PDF</strong> on any study pack to download the whole thing — summary,
          key points, flashcards, and quiz with correct answers marked — as a printable PDF file.</p>
        </Section>

        <Section title="6. Organizing with subjects">
          <p>Give related uploads the same subject (e.g. "Math", "History") and filter your
          Dashboard by subject using the pills that appear above your study pack list once you
          have more than one subject.</p>
        </Section>

        <Section title="7. Regenerating a study pack">
          <p>Not happy with how a study pack turned out? Click <strong>↺ Regenerate</strong> to
          have the AI reprocess the same file from scratch.</p>
        </Section>

        <Section title="8. Tools">
          <p>The <strong>Tools</strong> tab has three calculators, no account features needed:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Grade calculator</strong> — enter assignment grades and weights to find
            your current overall grade, or figure out what you need on a final exam to hit a goal.</li>
            <li><strong>GPA calculator</strong> — enter each course's type (AP/KAP/ACA), grade, and
            credit hours to calculate a weighted GPA.</li>
            <li><strong>Citations</strong> — generate a website citation in MLA or APA format.</li>
          </ul>
        </Section>

        <Section title="9. Settings">
          <p>Switch between light and dark themes, set a default quiz difficulty so you don't have
          to pick it on every upload, update your display name, or change your password — all from
          the <strong>Settings</strong> page.</p>
        </Section>
      </div>
    </div>
  );
}
