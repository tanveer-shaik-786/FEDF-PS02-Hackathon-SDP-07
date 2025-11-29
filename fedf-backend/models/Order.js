const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String
  },
  items: [{
    id: String,
    name: String,
    price: Number,
    qty: Number
  }],
  subtotal: Number,
  shipping: Number,
  gst: Number,
  codFee: Number,
  total: { type: Number, required: true },
  paymentMethod: String,
  status: { type: String, default: 'pending' }, // pending, completed, cancelled
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
