const router = require('express').Router();
const { seedDatabase } = require('../seed');

// Development-only endpoint to reseed the database.
router.post('/', async (req, res) => {
  if (process.env.NODE_ENV !== 'development' && process.env.USE_IN_MEMORY_DB !== '1') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    await seedDatabase();
    return res.json({ ok: true, message: 'Database seeded' });
  } catch (e) {
    console.error('Seed route error', e);
    return res.status(500).json({ ok: false, message: e.message || 'Seed failed' });
  }
});

module.exports = router;
