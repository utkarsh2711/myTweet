const { validationResult } = require('express-validator')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// @ USER REGISTRATION
var userRegistration = async (req, res) => {
  // console.log(req.body)

  // Checking If there are validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // Destructuring request body to get data
  const { name, email, password } = req.body

  try {
    // See if user exits
    let user = await User.findOne({ email })

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exits' }] })
    }

    // Get User Gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    })

    // Creating a new obejct of user if user not exist in db
    user = new User({
      name,
      email,
      avatar,
      password,
    })

    // encrypt Password
    var salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    // Saving user data
    await user.save()

    // Return json web token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// @ USER LOGIN
let userLogin = async (req, res) => {
  // Checking If there are validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  // Destructuring request body to get data
  const { email, password } = req.body

  try {
    // See if user exits
    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentails' }] })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentails' }] })
    }

    // Return json web token
    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err
        res.json({ token })
      }
    )
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

module.exports = {
  userRegistration,
  userLogin,
}
