const CustomError = require('../errors')
const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser === 'admin') return
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError.UnauthorizedError('not author to this route')
}
module.exports = checkPermissions
