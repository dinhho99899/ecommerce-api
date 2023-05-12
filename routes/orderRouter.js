const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
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
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission('admin'), getAllOrders)
router.route('/getAllMyOrders').get(authenticateUser, getCurrentUserOrders)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
module.exports = router
