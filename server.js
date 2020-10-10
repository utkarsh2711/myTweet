const express = require('express')
const connectDB = require('./config/db')

const app = express()

// Connecting to DB
connectDB()

// Init Middleware
app.use(express.json({ extended: false }))

// Test API
app.get('/', (req, res) => {
  res.send(`API Running`)
})

// Importing routes
const testRoutes = require('./routes/test')
const userRoutes = require('./routes/users')
const profileRoutes = require('./routes/profile')
const postRoutes = require('./routes/posts')

//Consuming Routes
app.use('/mytweet/api', testRoutes)
app.use('/mytweet/api', userRoutes)
app.use('/mytweet/api', postRoutes)
app.use('/mytweet/api', profileRoutes)

// PORT Nukber to which server runs on
const PORT = process.env.PORT || 3500

// Starting Sevrer on Defined PORT Number
app.listen(PORT, () => {
  console.log(`Server Started on PORT : ${PORT}`)
})
