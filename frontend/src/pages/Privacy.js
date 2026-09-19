export default function Privacy() {
  const Section = ({ title, children }) => (
    <div className="card" style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{title}</h2>
      <div style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: 14 }}>{children}</div>
    </div>
  );

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>Last updated {new Date().toLocaleDateString()}</p>

        <Section title="What we collect">
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Your name, email, and a securely hashed password (we never store your actual password)</li>
            <li>Files and photos you upload, and the text extracted from them</li>
            <li>The study packs generated from that content</li>
            <li>Basic usage data via Google Analytics (pages visited, general activity)</li>
          </ul>
        </Section>

        <Section title="How it's used">
          <p>Solely to run the app: authenticating you, generating your study packs, and letting you
          access your own history. Your uploaded content is sent to Groq's AI API to generate summaries,
          flashcards, and quizzes — it is not used to train any AI model.</p>
        </Section>

        <Section title="Who we share it with">
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li><strong>Groq</strong> — processes your document text to generate study pack content</li>
            <li><strong>MongoDB Atlas</strong> — stores your account and study pack data</li>
            <li><strong>Render &amp; Vercel</strong> — host the backend and frontend</li>
            <li><strong>Google Analytics</strong> — anonymized usage statistics</li>
          </ul>
          <p style={{ marginTop: 8 }}>We never sell your data.</p>
        </Section>

        <Section title="Shared links">
          <p>If you enable a public share link for a study pack, its content — and your name, if you
          choose to include it — becomes visible to anyone with that link. Disabling the link removes
          public access immediately.</p>
        </Section>

        <Section title="Your choices">
          <p>You can update your name or password anytime in Settings. To delete your account or data
          entirely, email <a href="mailto:rohanpgp@gmail.com" style={{ color: 'var(--indigo-500)', fontWeight: 600 }}>rohanpgp@gmail.com</a> and it will be removed.</p>
        </Section>

        <Section title="Kids &amp; students">
          <p>This app is often used by students. We don't knowingly collect more information than
          necessary to run the service, and we don't use uploaded homework for anything besides
          generating your own study pack.</p>
        </Section>
      </div>
    </div>
  );
}
