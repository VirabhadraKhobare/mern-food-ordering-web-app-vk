const mongoose = require('mongoose');
const RestaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  address: String,
  status: { type: String, default: 'active' }
});
module.exports = mongoose.model('Restaurant', RestaurantSchema);
