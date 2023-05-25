const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const Order = require('../models/Order')
const Product = require('../models/Product')
const { checkPermission } = require('../ultil')
const nodemailer = require('nodemailer')
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
  const total = subtotal + shippingFee + Number(tax)
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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'quahatkhontv@gmail.com',
      pass: 'vrareybxpdgotkvk', // naturally, replace both with your real credentials or an application-specific password
    },
  })
  const { _id } = order
  const htMl = orderItems
    .map((item) => {
      const { name, price, amount } = item
      return `<tr><td style='padding:5px 15px;text-transform: capitalize'>${name}</td><td style='padding:5px 15px'>${price}</td><td style='padding:5px 15px'>${amount}</td></tr>`
    })
    .join('')
  console.log(htMl)
  const mailOptions = {
    from: 'quahatkhontv@gmail.com',
    to: 'dinhho99899@gmail.com, enemiesofenron@gmail.com',
    subject: 'Order complete! Thank you so much for choosing us',
    html: `
    <!doctype html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><div><h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Thank you for your purchase!</h1><p>Your order is being processed and should arrive at your destination within 5 days. Thank you again your purchase. We would love to hear from you once you receive your items.
</p><p>Your order id is ${_id}</p><table border="1" style='border-collapse:collapse;text-align:center;padding:12px'><tbody style='border-collapse:collapse;text-align:center;padding:12px'><tr><th style='padding:5px 15px'>Name</th><th style='padding:5px 15px'>Price</th><th style='padding:5px 15px'>Amount</th></tr>${htMl}<tr><td style='padding:5px 15px'></td><td style='padding:5px 15px'></td><td style='padding:5px 15px'>${total}đ</td></tr>
</tbody></table><p>Kind Regards</p><p>NTV Nuts</p></div><style></style></body></html>`,
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      return error
    } else {
      console.log('Email sent: ' + info.response)
      return info.response
    }
  })

  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
    msg: 'Order successfully! Thank for your purchasing',
  })
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
const createOrderWithoutAuth = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError(' No cart items provided')
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
  const total = subtotal + shippingFee + Number(tax)
  const paymentItent = await fakeStripeAPI({ amount: total, currency: 'usd' })
  const order = await Order.create({
    orderItems,
    tax,
    shippingFee,
    total,
    subtotal,
    clientSecret: paymentItent.client_secret,
    user: '645e806ea50e6c27ac22df9a',
  })
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'quahatkhontv@gmail.com',
      pass: 'vrareybxpdgotkvk', // naturally, replace both with your real credentials or an application-specific password
    },
  })
  const { _id } = order
  const htMl = orderItems
    .map((item) => {
      const { name, price, amount } = item
      return `<tr><td style='padding:5px 15px;text-transform: capitalize'>${name}</td><td style='padding:5px 15px'>${price}</td><td style='padding:5px 15px'>${amount}</td></tr>`
    })
    .join('')
  console.log(htMl)
  const mailOptions = {
    from: 'quahatkhontv@gmail.com',
    to: 'dinhho99899@gmail.com, enemiesofenron@gmail.com',
    subject: 'Order complete! Thank you so much for choosing us',
    html: `
    <!doctype html><html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><div><h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Thank you for your purchase!</h1><p>Your order is being processed and should arrive at your destination within 5 days. Thank you again your purchase. We would love to hear from you once you receive your items.
</p><p>Your order id is ${_id}</p><table border="1" style='border-collapse:collapse;text-align:center;padding:12px'><tbody style='border-collapse:collapse;text-align:center;padding:12px'><tr><th style='padding:5px 15px'>Name</th><th style='padding:5px 15px'>Price</th><th style='padding:5px 15px'>Amount</th></tr>${htMl}<tr><td style='padding:5px 15px'></td><td style='padding:5px 15px'></td><td style='padding:5px 15px'>${total}đ</td></tr>
</tbody></table><p>Kind Regards</p><p>NTV Nuts</p></div><style></style></body></html>`,
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      return error
    } else {
      console.log('Email sent: ' + info.response)
      return info.response
    }
  })

  res.status(StatusCodes.CREATED).json({
    order,
    clientSecret: order.clientSecret,
    msg: 'Order successfully! Thank for your purchasing',
  })
}
module.exports = {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
  createOrderWithoutAuth,
}
