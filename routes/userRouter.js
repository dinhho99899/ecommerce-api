const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
} = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers.js/userController')

router.route('/').get(authenticateUser, authorizePermission, getAllUsers)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/updateUser').patch(authenticateUserbyToken, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.route('/:id').get(authenticateUser, getSingleUser)
module.exports = router
