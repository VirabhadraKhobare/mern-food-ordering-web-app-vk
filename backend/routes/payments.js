const router = require('express').Router();
const Stripe = require('stripe');
const Dish = require('../models/Dish');

const stripeKey = process.env.STRIPE_SECRET_KEY;
if(!stripeKey){
  console.warn('STRIPE_SECRET_KEY not set - payments will fail until configured');
}
const stripe = stripeKey ? Stripe(stripeKey) : null;

// Create a payment intent. Body: { items: [{ dishId, quantity }], currency?: 'usd' }
router.post('/create-payment-intent', async (req,res)=>{
  try{
    if(!stripe) return res.status(500).json({ message: 'Stripe not configured on server' });
    const { items, currency } = req.body || {};
    if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({ message: 'No items provided' });

    const ids = items.map(i=> i.dishId);
    const dishes = await Dish.find({ _id: { $in: ids } });
    const dishMap = new Map(dishes.map(d=> [d._id.toString(), d] ));

    let amount = 0;
    for(const it of items){
      const d = dishMap.get(it.dishId);
      if(!d) return res.status(400).json({ message: 'Invalid dish in items' });
      amount += (d.price || 0) * (it.quantity || 1);
    }

    // Add delivery fee in cents (server uses smallest currency unit). Choose a fee or compute.
    const deliveryFee = 200; // in cents (e.g., $2.00)
    const finalAmount = Math.round((amount * 100)) + deliveryFee;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: (currency || 'usd'),
      automatic_payment_methods: { enabled: true }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }catch(e){
    console.error('create-payment-intent error', e);
    res.status(500).json({ message: 'Payment intent creation failed', error: e.message });
  }
});

module.exports = router;
