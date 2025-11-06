const router = require('express').Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

router.post('/', auth, async (req,res)=>{
  const { items, restaurantId } = req.body;
  if(!items || !items.length) return res.status(400).json({message:'No items'});
  const total = items.reduce((s,i)=> s + (i.price * i.quantity), 0);
  const restaurantEarning = total * 0.9; // example: 10% platform fee
  const order = new Order({ customerId: req.user._id, restaurantId, items, totalAmount: total, restaurantEarning });
  await order.save();
  res.json(order);
});

router.get('/customer', auth, async (req,res)=>{
  const orders = await Order.find({ customerId: req.user._id }).populate('restaurantId').sort({ orderDate: -1 });
  res.json(orders);
});

router.get('/received', auth, async (req,res)=>{
  if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if(!restaurant) return res.json([]);
  const orders = await Order.find({ restaurantId: restaurant._id }).sort({ orderDate: -1 });
  res.json(orders);
});

router.put('/:id/status', auth, async (req,res)=>{
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status, deliveredAt: status === 'delivered' ? new Date() : undefined }, { new:true });
  res.json(order);
});

module.exports = router;
