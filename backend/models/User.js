const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer','owner'], default: 'customer' },
  memberSince: { type: Date, default: Date.now },
  status: { type: String, default: 'active' }
});
module.exports = mongoose.model('User', UserSchema);
