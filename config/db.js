const mongoos = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoos.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Mongo DB Connected...')
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}

module.exports = connectDB
