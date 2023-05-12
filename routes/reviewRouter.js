const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
} = require('../controllers.js/ReviewController')
router.route('/').post(authenticateUser, createReview).get(getAllReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)
module.exports = router
