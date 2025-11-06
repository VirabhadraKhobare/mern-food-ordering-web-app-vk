const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', auth, async (req,res)=> {
  res.json(req.user);
});

router.put('/profile', auth, async (req,res)=> {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new:true }).select('-password');
  res.json(user);
});

module.exports = router;
