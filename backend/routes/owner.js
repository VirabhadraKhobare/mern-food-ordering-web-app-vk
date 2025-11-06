const router = require('express').Router();
const auth = require('../middleware/auth');
const Dish = require('../models/Dish');
const Restaurant = require('../models/Restaurant');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

async function uploadToS3(buffer, filename, mimetype){
  const bucket = process.env.AWS_S3_BUCKET;
  if(!bucket) return null;
  const key = 'uploads/' + filename;
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, Body: buffer, ContentType: mimetype, ACL: 'public-read' });
  await s3Client.send(cmd);
  const url = (process.env.AWS_S3_BASE_URL || `https://${bucket}.s3.amazonaws.com`) + '/' + key;
  return url;
}

// Owner add new dish (owner must have restaurant). Accepts optional image file in 'image'
router.post('/dishes', auth, upload.single('image'), async (req,res)=>{
  try{
    if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
    let restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if(!restaurant){
      restaurant = new Restaurant({ ownerId: req.user._id, name: req.body.restaurantName || (req.user.firstName + ' Restaurant'), address: req.body.address || '' });
      await restaurant.save();
    }
    const payload = { 
      restaurantId: restaurant._id,
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price || 0),
      category: req.body.category,
      isPopular: req.body.isPopular === 'true' || req.body.isPopular === true
    };
    if(req.file){
      // try S3 upload first if bucket provided
      const filename = Date.now() + '-' + Math.round(Math.random()*1e9) + path.extname(req.file.originalname);
      let url = null;
      try{
        url = await uploadToS3(req.file.buffer, filename, req.file.mimetype);
      }catch(e){ console.warn('S3 upload failed', e.message); }
      if(!url){
        // fallback to disk
        const out = path.join(__dirname, '..', 'uploads', filename);
        fs.writeFileSync(out, req.file.buffer);
        url = '/uploads/' + filename;
      }
      payload.imageURL = url;
    }
    const dish = new Dish(payload);
    await dish.save();
    res.json(dish);
  }catch(e){ console.error(e); res.status(500).json({message:e.message}); }
});

router.get('/dishes', auth, async (req,res)=>{
  if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  const dishes = restaurant ? await Dish.find({ restaurantId: restaurant._id }) : [];
  res.json(dishes);
});

router.put('/dishes/:id', auth, async (req,res)=>{
  if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
  const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new:true });
  res.json(dish);
});

router.delete('/dishes/:id', auth, async (req,res)=>{
  if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
  await Dish.findByIdAndDelete(req.params.id);
  res.json({message:'Deleted'});
});

router.get('/earnings', auth, async (req,res)=>{
  if(req.user.role !== 'owner') return res.status(403).json({message:'Forbidden'});
  const Restaurant = require('../models/Restaurant');
  const Order = require('../models/Order');
  const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
  if(!restaurant) return res.json({ totalEarnings: 0 });
  const orders = await Order.find({ restaurantId: restaurant._id, status: 'delivered' });
  const total = orders.reduce((s,o)=> s + (o.restaurantEarning || 0), 0);
  res.json({ totalEarnings: total });
});

module.exports = router;
