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
  .post([authenticateUser, authorizePermission('admin')], createProduct)
  .get(authenticateUserbyToken, getAllProducts)

router
  .route('/:id')
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete([authenticateUser, authorizePermission('admin')], deleteProduct)
  .get(getSingleProduct)
router.route('/uploadImage').post(authenticateUserbyToken, uploadImageCloud)
router.route('/:id/reviews').get(authenticateUser, getSingleProductReviews)
module.exports = router
