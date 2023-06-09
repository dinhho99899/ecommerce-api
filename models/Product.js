const mongoose = require('mongoose')
const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide name'],
      trim: true,
      maxlength: [100, 'name cannot be more than 100 character'],
    },
    category: {
      type: String,
      required: [true, 'please provide product category'],
      enum: [
        'Hạt sống',
        'Hạt sấy chín ăn liền',
        'Hoa quả sấy khô',
        'Mix hạt dinh dưỡng',
      ],
    },
    description: {
      type: String,
      required: [true, 'please provide desciption'],
      maxlength: [1000, 'name cannot be more than 1000 character'],
    },
    price: {
      type: Number,
      required: [true, 'please provide price'],
      default: 0,
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    usermanual: {
      type: String,
      required: [true, 'please provide name'],
    },
    company: {
      type: String,
      required: [true, 'please provide company'],
      default: 'ntv nuts',
    },
    colors: {
      type: [String],
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)
ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})
ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id })
})
module.exports = mongoose.model('Product', ProductSchema)
