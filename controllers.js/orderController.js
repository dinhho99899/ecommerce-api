const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { checkPermission } = require('../ultil')
const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someSecretValue'
  return { client_secret, amount }
}
const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(' No cartitems provided')
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      ' Please provided tax or shipping fee'
    )
  }
  let orderItems = []
  let subtotal = 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`No product with id ${item.product}`)
    }
    const { name, price, image, _id } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    }
    orderItems = [...orderItems, singleOrderItem]
    subtotal += item.amount * price
  }
  const total = subtotal + shippingFee + tax
  const paymentItent = await fakeStripeAPI({ amount: total, currency: 'usd' })
  const order = await Order.create({
    orderItems,
    tax,
    shippingFee,
    total,
    subtotal,
    clientSecret: paymentItent.client_secret,
    user: req.user.userId,
  })
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret })
}
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError('No order with id this id')
  }
  checkPermission(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentItentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new CustomError.NotFoundError('No order with this id')
  }
  checkPermission(req.user, order.user)
  order.paymentItentId = paymentItentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}
module.exports = {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
}
