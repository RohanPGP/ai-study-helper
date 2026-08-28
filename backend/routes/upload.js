const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const os = require('os');
const StudyPack = require('../models/StudyPack');
const { protect, requireSubscription } = require('../middleware/auth');
const { extractText } = require('../utils/fileExtractor');
const { generateStudyPack } = require('../utils/aiService');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
  }
});

// POST /upload  — upload + kick off AI processing
router.post('/', protect, requireSubscription, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const title = req.body.title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, '');

  // Create a pending study pack immediately
  const pack = await StudyPack.create({
    userId: req.user._id,
    title,
    originalFilename: req.file.originalname,
    status: 'processing'
  });

  // Return the pack ID right away — processing happens async
  res.status(202).json({
    message: 'File uploaded. Processing has started.',
    studyPackId: pack._id
  });

  // Async processing (fire and forget — client polls /history/:id)
  setImmediate(async () => {
    try {
      const { text, fileType } = await extractText(req.file.path, req.file.mimetype);

      if (!text || text.trim().length < 50) throw new Error('Not enough text content to process');

      const aiResult = await generateStudyPack(text, title);

      await StudyPack.findByIdAndUpdate(pack._id, {
        fileType,
        extractedText: text,
        summary: aiResult.summary,
        keyPoints: aiResult.keyPoints || [],
        flashcards: aiResult.flashcards || [],
        quiz: aiResult.quiz || [],
        status: 'ready'
      });
    } catch (err) {
      console.error('Processing error for pack', pack._id, err.message);
      await StudyPack.findByIdAndUpdate(pack._id, {
        status: 'error',
        errorMessage: err.message
      });
    }
  });
});

module.exports = router;
