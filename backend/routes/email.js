const router = require('express').Router();
const nodemailer = require('nodemailer');
const StudyPack = require('../models/StudyPack');
const { protect, requireSubscription } = require('../middleware/auth');

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

const buildEmailHTML = (pack, user) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 680px; margin: 0 auto; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; padding: 32px; }
    .header h1 { margin: 0 0 8px; font-size: 24px; }
    .header p { margin: 0; opacity: 0.85; }
    .body { padding: 32px; }
    h2 { color: #4f46e5; font-size: 18px; margin: 28px 0 12px; border-left: 4px solid #4f46e5; padding-left: 12px; }
    p { color: #374151; line-height: 1.7; }
    .keypoint { background: #f5f3ff; border-radius: 8px; padding: 10px 14px; margin: 8px 0; color: #3730a3; font-size: 14px; }
    .flashcard { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px; margin: 10px 0; }
    .flashcard .q { font-weight: 600; color: #111827; margin-bottom: 6px; }
    .flashcard .a { color: #6b7280; font-size: 14px; }
    .quiz-item { margin: 14px 0; }
    .quiz-item .qtext { font-weight: 600; color: #111827; margin-bottom: 8px; }
    .option { padding: 6px 10px; font-size: 14px; color: #374151; }
    .option.correct { background: #d1fae5; border-radius: 6px; color: #065f46; font-weight: 600; }
    .footer { background: #f9fafb; padding: 20px 32px; text-align: center; color: #9ca3af; font-size: 13px; }
    .btn { display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 8px; padding: 12px 28px; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>📚 Your Study Pack is Ready!</h1>
      <p>Hi ${user.name}, here's your AI-generated study pack for <strong>${pack.title}</strong></p>
    </div>
    <div class="body">
      <h2>📝 Summary</h2>
      <p>${pack.summary}</p>

      <h2>🔑 Key Points</h2>
      ${pack.keyPoints.map(kp => `<div class="keypoint">• ${kp}</div>`).join('')}

      <h2>🃏 Flashcards (${pack.flashcards.length})</h2>
      ${pack.flashcards.slice(0, 5).map(fc => `
        <div class="flashcard">
          <div class="q">Q: ${fc.question}</div>
          <div class="a">A: ${fc.answer}</div>
        </div>
      `).join('')}
      ${pack.flashcards.length > 5 ? `<p style="color:#6b7280;font-size:13px;">+ ${pack.flashcards.length - 5} more flashcards in the app</p>` : ''}

      <h2>📋 Quiz Preview (${pack.quiz.length} questions)</h2>
      ${pack.quiz.slice(0, 3).map((q, i) => `
        <div class="quiz-item">
          <div class="qtext">${i + 1}. ${q.question}</div>
          ${q.options.map((opt, idx) => `
            <div class="option ${idx === q.correctIndex ? 'correct' : ''}">
              ${String.fromCharCode(65 + idx)}. ${opt}${idx === q.correctIndex ? ' ✓' : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}

      <center>
        <a class="btn" href="${process.env.FRONTEND_URL}/study-pack/${pack._id}">Open Full Study Pack →</a>
      </center>
    </div>
    <div class="footer">
      AI Study Helper · <a href="${process.env.FRONTEND_URL}">Open App</a>
    </div>
  </div>
</body>
</html>`;

// POST /email/send/:id
router.post('/send/:id', protect, requireSubscription, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    if (pack.status !== 'ready') return res.status(400).json({ error: 'Study pack is not ready yet' });

    const transporter = createTransporter();
    await transporter.verify();

    const toEmail = req.body.email || req.user.email;

    await transporter.sendMail({
      from: `"AI Study Helper" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `📚 Study Pack Ready: ${pack.title}`,
      html: buildEmailHTML(pack, req.user)
    });

    await StudyPack.findByIdAndUpdate(pack._id, { emailSent: true, emailSentAt: new Date() });

    res.json({ message: `Study pack emailed to ${toEmail}` });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

module.exports = router;
