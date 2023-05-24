const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
} = require('../middleware/authentication')
const {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} = require('../controllers.js/orderController')
router
  .route('/')
  .post(authenticateUserbyToken, createOrder)
  .get(authenticateUserbyToken, getAllOrders)
router
  .route('/getAllMyOrders')
  .get(authenticateUserbyToken, getCurrentUserOrders)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
module.exports = router
