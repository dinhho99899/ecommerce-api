const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
} = require('../middleware/authentication')
const { fullAuthenticateUser } = require('../middleware/full-auth')
const {
  getSingleProductReviews,
} = require('../controllers.js/ReviewController')
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  uploadImageCloud,
} = require('../controllers.js/productController')
router
  .route('/')
  .post(authenticateUserbyToken, createProduct)
  .get(authenticateUserbyToken, getAllProducts)

router
  .route('/:id')
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete(authenticateUserbyToken, deleteProduct)
  .get(getSingleProduct)
router.route('/uploadImage').post(authenticateUserbyToken, uploadImageCloud)
router.route('/:id/reviews').get(authenticateUser, getSingleProductReviews)
module.exports = router
