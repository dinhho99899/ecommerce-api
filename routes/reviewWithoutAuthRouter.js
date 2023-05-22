const express = require('express')
const router = express.Router()
const {
  getSingleProductReviewsbyWithoutAuthor,
} = require('../controllers.js/ReviewController')
router.route('/:id').get(getSingleProductReviewsbyWithoutAuthor)
module.exports = router
