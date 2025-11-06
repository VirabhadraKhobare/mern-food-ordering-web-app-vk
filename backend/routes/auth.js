const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req,res)=>{
  try{
    const { firstName,lastName,email,password,role } = req.body;
    if(!email || !password) return res.status(400).json({message:'email and password required'});
    let user = await User.findOne({email});
    if(user) return res.status(400).json({message:'User exists'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user = new User({ firstName,lastName,email,password:hash,role });
    await user.save();
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'your_jwt_secret',{expiresIn:'7d'});
    res.json({ token, user: { email: user.email, firstName: user.firstName, role: user.role } });
  }catch(e){ res.status(500).json({message:e.message}); }
});

router.post('/login', async (req,res)=>{
  try{
    const { email,password } = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'your_jwt_secret',{expiresIn:'7d'});
    res.json({ token, user: { email: user.email, firstName: user.firstName, role: user.role } });
  }catch(e){ res.status(500).json({message:e.message}); }
});

module.exports = router;
