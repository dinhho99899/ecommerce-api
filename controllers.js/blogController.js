const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const createBlog = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}
