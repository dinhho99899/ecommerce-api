const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
  x,
} = require('../middleware/authentication')
const {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
  createOrderWithoutAuth,
  getStats,
} = require('../controllers.js/orderController')
router
  .route('/')
  .post(authenticateUserbyToken, createOrder)
  .get(authenticateUserbyToken, getAllOrders)
router
  .route('/getAllMyOrders')
  .get(authenticateUserbyToken, getCurrentUserOrders),
  router.route('/createOrderWithoutAuth').post(createOrderWithoutAuth)
router.route('/getStats').get(authenticateUserbyToken, getStats)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
module.exports = router
