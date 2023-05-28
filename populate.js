const dotenv = require('dotenv').config()
const mockData = require('./mockData.json')
const Product = require('./models/Product')
const connectDb = require('./db/connect')
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URL)
    await Product.create(mockData)
    console.log('success')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
start()
