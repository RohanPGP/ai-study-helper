const router = require('express').Router();
const StudyPack = require('../models/StudyPack');

router.get('/:token', async (req, res) => {
  try {
    const pack = await StudyPack.findOne({ shareToken: req.params.token, status: 'ready' })
      .select('title subject summary keyPoints flashcards quiz createdAt shareShowCreator userId')
      .populate('userId', 'name');
    if (!pack) return res.status(404).json({ error: 'Shared study pack not found' });

    const result = pack.toObject();
    result.creatorName = pack.shareShowCreator ? (pack.userId?.name || null) : null;
    delete result.userId;
    delete result.shareShowCreator;

    res.json({ pack: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load shared study pack' });
  }
});

module.exports = router;
