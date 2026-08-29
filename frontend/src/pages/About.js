export default function About() {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 640 }}>
        <div className="card">
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 16 }}>About AI Study Helper</h1>

          <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: 24 }}>
            AI Study Helper turns any homework file — a PDF, Word doc, or text file — into a
            complete study pack in seconds. Upload your material and get an AI-generated summary,
            key points, flashcards, and a quiz, all built to help you study smarter and review faster.
          </p>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Created by</h2>
          <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: 24 }}>
            Rohan Sharma, a student at Jordan High School.
          </p>

          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Contact</h2>
          <p style={{ color: 'var(--gray-700)', lineHeight: 1.8, marginBottom: 24 }}>
            <a href="mailto:rohanpgp@gmail.com" style={{ color: 'var(--indigo-500)', fontWeight: 600 }}>
              rohanpgp@gmail.com
            </a>
          </p>

          <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 32, borderTop: '1px solid var(--gray-200)', paddingTop: 16 }}>
            © {new Date().getFullYear()} Rohan Sharma. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
