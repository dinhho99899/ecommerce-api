require('dotenv').config()
require('express-async-errors')
//express
const express = require('express')
const app = express()

//database
const connectDb = require('./db/connect')
//packages
const morgan = require('morgan')
const parse = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})
//routers
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const productRouter = require('./routes/productRouter')
const reviewRouter = require('./routes/reviewRouter')
const orderRouter = require('./routes/orderRouter')
const noAuthorRouter = require('./routes/noAuthorRouter')
const reviewWithoutAuthRouter = require('./routes/reviewWithoutAuthRouter')
//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Too many request',
  })
)
app.use(helmet())
app.use(cors(corsOptions))
app.use(xss())
app.use(mongoSanitize())
app.use(morgan('tiny'))
app.use(express.json())
app.use(parse(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload({ useTempFiles: true }))

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies)
  res.send('ecommerce api')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/orders', orderRouter)
app.use('/api/v1/admin', noAuthorRouter)
app.use('/api/v1/noauth/reviews', reviewWithoutAuthRouter)
app.use(notFoundMiddleware)
app.use(errorHandler)
const port = process.env.PORT || 5000
const start = async () => {
  try {
    connectDb(process.env.MONGO_URL)
    app.listen(port, console.log(`Server listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()
