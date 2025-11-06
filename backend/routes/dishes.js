const router = require('express').Router();
const Dish = require('../models/Dish');

// Get all dishes or by category / popular
router.get('/', async (req,res)=>{
  const { category, popular, q } = req.query;
  const filter = {};
  if(category) filter.category = category;
  if(popular === 'true') filter.isPopular = true;
  if(q) filter.name = new RegExp(q,'i');
  const dishes = await Dish.find(filter).limit(100);
  res.json(dishes);
});

router.get('/:id', async (req,res)=>{
  const d = await Dish.findById(req.params.id);
  if(!d) return res.status(404).json({message:'Not found'});
  res.json(d);
});

module.exports = router;
