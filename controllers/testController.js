const User = require('../models/User')

var testAPI = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.send(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

module.exports = {
  testAPI,
}
