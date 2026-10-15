const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const { getChatReply } = require('../utils/chatService');

const SITE_FAQ = `
TutorPulseAI facts you can use to help students with questions about the site itself:
- Students upload a PDF, DOCX, TXT, or image (or scan homework with their camera) and TutorPulseAI generates a study pack: summary, key points, flashcards, and a quiz.
- Difficulty can be set to easy, medium, or hard, and a default difficulty can be saved in Settings.
- Study packs can be organized by subject, edited (title/subject) after creation, exported as a PDF, and retaken (missed quiz questions only).
- Study packs can be shared via a read-only public link, optionally showing the creator's name, from the study pack page.
- Limits: 10MB per file, up to 10 photos per camera scan, and about 4-8 pages (~12,000 characters) of text processed per study pack.
- The Tools page has a Grade Calculator, GPA Calculator (supports AP/KAP/ACA course types), and a Citation Generator (MLA/APA).
- TutorPulseAI is completely free to use.
`;

const BASE_PERSONA = `You are the TutorPulseAI study assistant: a friendly, encouraging AI tutor for students.
Help with homework questions directly (explain concepts, work through problems step by step, give examples) the way a patient tutor would - don't just give final answers to obvious homework-check questions without explaining the reasoning.
You can also answer questions about how to use the TutorPulseAI website itself using the facts below.
Keep answers concise and easy to read in a small chat window (short paragraphs or bullet points, avoid walls of text). Do not use LaTeX notation (no \\frac, \\sqrt, etc.) - write math in plain text instead.
${SITE_FAQ}`;

// Keyed by logged-in user id (not IP) so one student can't use up a shared
// school-network IP's quota and lock out classmates on the same network.
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 messages per 10 minutes per student
  keyGenerator: (req) => (req.user ? req.user.id : req.ip),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "You're sending messages too quickly. Please wait a few minutes and try again." },
});

const MAX_MESSAGE_LENGTH = 2000;

router.post('/', protect, chatLimiter, async (req, res) => {
  try {
    const { message, history, studyPack } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` });
    }

    let systemContent = BASE_PERSONA;
    if (studyPack && (studyPack.title || studyPack.summary)) {
      systemContent += `\n\nThe student is currently viewing this study pack titled "${studyPack.title || 'Untitled'}" (subject: ${studyPack.subject || 'N/A'}). Use it to answer follow-up questions about this specific material when relevant:\nSummary: ${studyPack.summary || ''}\nKey Points: ${(studyPack.keyPoints || []).join('; ')}`;
    }

    const trimmedHistory = Array.isArray(history) ? history.slice(-8) : [];
    const messages = [
      { role: 'system', content: systemContent },
      ...trimmedHistory.filter((m) => m && m.role && m.content).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const reply = await getChatReply(messages);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Failed to get a response. Please try again.' });
  }
});

module.exports = router;
