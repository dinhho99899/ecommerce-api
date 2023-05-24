const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
} = require('../middleware/authentication')
const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers.js/ReviewController')
router.route('/').post(authenticateUserbyToken, createReview).get(getAllReviews)

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)
module.exports = router
