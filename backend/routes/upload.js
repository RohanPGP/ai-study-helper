const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const os = require('os');
const StudyPack = require('../models/StudyPack');
const { protect, requireSubscription } = require('../middleware/auth');
const { extractText } = require('../utils/fileExtractor');
const { extractTextFromImages } = require('../utils/ocrService');
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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
  }
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

router.post('/', protect, requireSubscription, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const title = req.body.title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, '');
  const subject = req.body.subject?.trim() || '';
  const difficulty = ['easy', 'medium', 'hard'].includes(req.body.difficulty) ? req.body.difficulty : 'medium';

  let pack;
  try {
    pack = await StudyPack.create({
      userId: req.user._id,
      title,
      subject,
      difficulty,
      originalFilename: req.file.originalname,
      status: 'processing'
    });
  } catch (err) {
    console.error('Failed to create study pack:', err.message);
    return res.status(500).json({ error: 'Failed to start upload. Please try again.' });
  }

  res.status(202).json({
    message: 'File uploaded. Processing has started.',
    studyPackId: pack._id
  });

  setImmediate(async () => {
    try {
      const { text, fileType } = await extractText(req.file.path, req.file.mimetype);

      if (!text || text.trim().length < 50) throw new Error('Not enough text content to process');

      const aiResult = await generateStudyPack(text, title, difficulty);

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

router.post('/camera', protect, requireSubscription, imageUpload.array('images', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No images uploaded' });

  const title = req.body.title?.trim() || 'Scanned Homework';
  const subject = req.body.subject?.trim() || '';
  const difficulty = ['easy', 'medium', 'hard'].includes(req.body.difficulty) ? req.body.difficulty : 'medium';

  let pack;
  try {
    pack = await StudyPack.create({
      userId: req.user._id,
      title,
      subject,
      difficulty,
      originalFilename: `${req.files.length} scanned page(s)`,
      status: 'processing'
    });
  } catch (err) {
    console.error('Failed to create study pack:', err.message);
    return res.status(500).json({ error: 'Failed to start upload. Please try again.' });
  }

  res.status(202).json({
    message: 'Images uploaded. Processing has started.',
    studyPackId: pack._id
  });

  setImmediate(async () => {
    try {
      const text = await extractTextFromImages(req.files.map(f => f.path));

      if (!text || text.trim().length < 50) throw new Error('Not enough text could be read from the photos. Try retaking clearer pictures.');

      const aiResult = await generateStudyPack(text, title, difficulty);

      await StudyPack.findByIdAndUpdate(pack._id, {
        fileType: 'image',
        extractedText: text,
        summary: aiResult.summary,
        keyPoints: aiResult.keyPoints || [],
        flashcards: aiResult.flashcards || [],
        quiz: aiResult.quiz || [],
        status: 'ready'
      });
    } catch (err) {
      console.error('Camera processing error for pack', pack._id, err.message);
      await StudyPack.findByIdAndUpdate(pack._id, {
        status: 'error',
        errorMessage: err.message
      });
    }
  });
});

module.exports = router;
