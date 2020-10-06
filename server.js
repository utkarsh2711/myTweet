const express = require('express')
const connectDB = require('./config/db')

const app = express()

// Connecting to DB
connectDB()

// Test API
app.get('/', (req, res) => {
  res.send(`API Running`)
})

// Importing routes
const testRoutes = require('./routes/test')

//Consuming Routes
app.use('/mytweet/api', testRoutes)

// PORT Nukber to which server runs on
const PORT = process.env.PORT || 3500

// Starting Sevrer on Defined PORT Number
app.listen(PORT, () => {
  console.log(`Server Started on PORT : ${PORT}`)
})
