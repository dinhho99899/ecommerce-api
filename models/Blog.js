const mongoose = require('mongoose')
const BlogSchema = mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
})
