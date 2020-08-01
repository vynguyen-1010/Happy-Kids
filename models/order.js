const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.Object,
    ref: "User"
  },
  cart: { 
    type: Object, 
    required: true },
  address: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: false,
    default: Date.now
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  //
  orderStatus: {
    type: String,
    default: "Đang chờ xử lý"
  },
  totalPrice: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Order", orderSchema);
