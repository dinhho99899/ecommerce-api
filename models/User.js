const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  location: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    required: [true, 'Please provide name'],
  },
  password: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dgfo67rxh/image/upload/v1684854394/ntvnuts/user_emf8sj.png',
  },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
})
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', UserSchema)
