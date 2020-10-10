const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  // Get Token From header
  const token = req.header('Authorization')

  // Check If no token
  if (!token) {
    return res.status(400).json({ msg: 'No Token - Authorization Denied' })
  }

  // Verify Token
  try {
    // Verify Token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    // If the token is not valid
    console.error(err)
    res.status(401).json({ msg: 'Unauthorized Access' })
  }
}
