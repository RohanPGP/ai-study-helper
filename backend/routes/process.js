const router = require('express').Router();
const StudyPack = require('../models/StudyPack');
const { protect, requireSubscription } = require('../middleware/auth');
const { generateStudyPack } = require('../utils/aiService');

// POST /process/:id  — re-run AI processing on an existing pack
router.post('/:id', protect, requireSubscription, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('+extractedText');

    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    if (!pack.extractedText) return res.status(400).json({ error: 'No source text to reprocess' });
    if (pack.status === 'processing') return res.status(409).json({ error: 'Already processing' });

    await StudyPack.findByIdAndUpdate(pack._id, { status: 'processing', errorMessage: null });

    res.json({ message: 'Reprocessing started', studyPackId: pack._id });

    setImmediate(async () => {
      try {
        const aiResult = await generateStudyPack(pack.extractedText, pack.title);
        await StudyPack.findByIdAndUpdate(pack._id, {
          summary: aiResult.summary,
          keyPoints: aiResult.keyPoints || [],
          flashcards: aiResult.flashcards || [],
          quiz: aiResult.quiz || [],
          status: 'ready'
        });
      } catch (err) {
        await StudyPack.findByIdAndUpdate(pack._id, { status: 'error', errorMessage: err.message });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start reprocessing' });
  }
});

// GET /process/:id/status
router.get('/:id/status', protect, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ _id: req.params.id, userId: req.user._id })
      .select('status errorMessage title updatedAt');
    if (!pack) return res.status(404).json({ error: 'Not found' });
    res.json({ status: pack.status, errorMessage: pack.errorMessage, title: pack.title });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

module.exports = router;
