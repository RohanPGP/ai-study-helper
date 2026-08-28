const router = require('express').Router();
const StudyPack = require('../models/StudyPack');
const { protect } = require('../middleware/auth');

// GET /history — all study packs for user
router.get('/', protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [packs, total] = await Promise.all([
      StudyPack.find(query)
        .select('-extractedText')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      StudyPack.countDocuments(query)
    ]);

    res.json({
      packs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /history/:id — single study pack (full detail)
router.get('/:id', protect, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ pack });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study pack' });
  }
});

// DELETE /history/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await StudyPack.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ message: 'Study pack deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete study pack' });
  }
});

module.exports = router;
