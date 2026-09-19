const router = require('express').Router();
const crypto = require('crypto');
const StudyPack = require('../models/StudyPack');
const { protect } = require('../middleware/auth');

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

router.get('/:id', protect, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ pack });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch study pack' });
  }
});

// PUT /history/:id — edit title/subject
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, subject } = req.body;
    const update = {};
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ error: 'Title cannot be empty' });
      update.title = title.trim();
    }
    if (subject !== undefined) update.subject = subject.trim();

    const pack = await StudyPack.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      update,
      { new: true }
    ).select('-extractedText');
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ pack });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update study pack' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await StudyPack.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ message: 'Study pack deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete study pack' });
  }
});

// POST /history/:id/share — enable a public read-only link, and set whether creator name shows
router.post('/:id/share', protect, async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ _id: req.params.id, userId: req.user._id });
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    if (!pack.shareToken) {
      pack.shareToken = crypto.randomBytes(12).toString('hex');
    }
    pack.shareShowCreator = !!req.body.showCreator;
    await pack.save();
    res.json({ shareToken: pack.shareToken, shareShowCreator: pack.shareShowCreator });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

router.delete('/:id/share', protect, async (req, res) => {
  try {
    const pack = await StudyPack.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { shareToken: null, shareShowCreator: false }
    );
    if (!pack) return res.status(404).json({ error: 'Study pack not found' });
    res.json({ message: 'Sharing disabled' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke share link' });
  }
});

module.exports = router;
