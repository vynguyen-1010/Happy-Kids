const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: Number,
    default: 0
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  isLock: {
    type: Boolean,
    default: false
  },
  verify_token: {
    type: String,
  },
  cart: {
    type: Object,
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
