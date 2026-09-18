const router = require('express').Router();
const StudyPack = require('../models/StudyPack');

// GET /share/:token — public, read-only, no auth required
router.get('/:token', async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ shareToken: req.params.token, status: 'ready' })
      .select('title subject summary keyPoints flashcards quiz createdAt');
    if (!pack) return res.status(404).json({ error: 'Shared study pack not found' });
    res.json({ pack });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load shared study pack' });
  }
});

module.exports = router;
