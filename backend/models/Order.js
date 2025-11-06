const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{ dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }, quantity: Number, price: Number }],
  totalAmount: Number,
  restaurantEarning: Number,
  status: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  deliveredAt: Date
});
module.exports = mongoose.model('Order', OrderSchema);
