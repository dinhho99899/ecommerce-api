const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
} = require('../middleware/authentication')
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
} = require('../controllers.js/productController')
router
  .route('/')
  .post([authenticateUser, authorizePermission('admin')], createProduct)
  .get(authenticateUser, getAllProducts)
router
  .route('/:id')
  .patch([authenticateUser, authorizePermission('admin')], updateProduct)
  .delete([authenticateUser, authorizePermission('admin')], deleteProduct)
  .get(getSingleProduct)
router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermission('admin')], uploadImage)
router.route('/:id/reviews').get(authenticateUser, getSingleProductReviews)
module.exports = router
