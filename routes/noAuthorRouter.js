const express = require('express')
const router = express.Router()
const {
  getAllProductsbyAdmin,
  getSingleProductbyAdmin,
} = require('../controllers.js/productController')
router.route('/').get(getAllProductsbyAdmin)
router.route('/:id').get(getSingleProductbyAdmin)
module.exports = router
