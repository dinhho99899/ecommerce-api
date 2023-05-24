const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const jwt = require('jsonwebtoken')
const {
  attachCookiesToResponse,
  createTokenUser,
  createJWT,
} = require('../ultil')
const register = async (req, res) => {
  const { email, name, password } = req.body
  if (!email || !password || !name) {
    throw new CustomError.BadRequestError('Please provide email or password')
  }
  const emailAlreadyExits = await User.findOne({ email })
  if (emailAlreadyExits) {
    throw new CustomError.BadRequestError('Email Already Exits')
  }
  const firstAccount = (await User.countDocuments({})) === 0
  const role = firstAccount ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  const tk = createJWT({ payload: tokenUser })
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: { ...tokenUser, token: tk } })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email or password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Email')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Password')
  }
  const tokenUser = {
    name: user.name,
    email: user.email,
    userId: user._id,
    role: user.role,
    avatar: user.avatar,
  }
  const tk = createJWT({ payload: tokenUser })
  attachCookiesToResponse({ res, user: tokenUser })
  res.status(StatusCodes.CREATED).json({ user: { ...tokenUser, token: tk } })
}
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = { register, login, logout }
