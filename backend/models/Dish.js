const mongoose = require('mongoose');
const DishSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: String,
  description: String,
  price: Number,
  category: String,
  imageURL: String,
  // 'type' indicates default type for the dish: 'veg' or 'nonveg'
  type: { type: String, enum: ['veg','nonveg'], required: false },
  // availableTypes allows multiple variants (e.g., ['veg','nonveg'])
  availableTypes: [{ type: String, enum: ['veg','nonveg'] }],
  isPopular: { type: Boolean, default: false },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 }
});
module.exports = mongoose.model('Dish', DishSchema);
