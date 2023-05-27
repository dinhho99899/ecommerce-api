const mongoose = require('mongoose')
const ReviewSchema = mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5, required: [true, 'please rates'] },
    title: {
      type: String,
      trim: true,
      required: [true, 'please provide title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'please comment'],
      maxlength: 500,
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Review', ReviewSchema)
