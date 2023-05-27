const Review = require('../models/Review')
const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermission,
} = require('../ultil')
const createReview = async (req, res) => {
  const { product: productId, rating } = req.body
  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`)
  }
  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  const reviews = await Review.find({ product: productId })
  const total = reviews.reduce((total, current) => {
    total += current.rating
    return total
  }, 0)
  const averageRating = total / reviews.length

  const product = await Product.findOneAndUpdate(
    { _id: productId },
    { averageRating },
    { new: true, runValidators: true }
  )
  res.status(StatusCodes.CREATED).json({ review })
}
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: 'product',
      select: 'name company price averageRating',
    })
    .populate({
      path: 'user',
      select: 'name avatar',
    })
  res.status(StatusCodes.OK).json({ reviews })
}
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { title, comment, rating } = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`)
  }
  checkPermission(req.user, review.user)
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({ msg: 'review updated' })
}
const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${req.params.id}`)
  }
  checkPermission(req.user, review.user)
  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'review deleted' })
}
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.findOne({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
const getSingleProductReviewsbyWithoutAuthor = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId }).populate({
    path: 'user',
    select: 'name avatar',
  })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
  getSingleProductReviewsbyWithoutAuthor,
}
