const mongoose = require('mongoose')
const SingleCartItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
})
const OrderSchema = mongoose.Schema(
  {
    tax: {
      type: String,
      require: true,
    },
    note: { type: String, default: 'Please ship faster' },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleCartItemSchema],
    status: {
      type: String,
      enum: ['pending', 'paid', 'false', 'failed', 'delivered', 'canceled'],
      default: 'pending',
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    clientSecret: { type: String, required: true },
    paymentItentId: {
      type: String,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Order', OrderSchema)
