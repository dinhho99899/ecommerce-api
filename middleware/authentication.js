const CustomError = require('../errors')
const { isTokenValid } = require('../ultil')
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new CustomError.UnauthenticatedError('authentication invalid')
  }
  try {
    const { name, userId, role } = isTokenValid({ token })
    req.user = { name, userId, role }

    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('authentication invalid')
  }
}
const authenticateUserbyToken = (req, res, next) => {
  let token
  // check header
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1]
  }
  if (!token) {
    throw new CustomError.UnauthenticatedError('authentication invalid')
  }
  try {
    const { name, userId, role } = isTokenValid({ token })
    req.user = { name, userId, role }

    next()
  } catch (error) {
    throw new CustomError.UnauthenticatedError('authentication invalid')
  }
}
const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'unauthorized to access this route'
      )
    }
    next()
  }
}
module.exports = {
  authenticateUser,
  authorizePermission,
  authenticateUserbyToken,
}
