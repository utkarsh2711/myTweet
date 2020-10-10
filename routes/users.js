const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

const usersController = require('../controllers/usersController')

// @route   POST mytweet/api/users
// @desc    Register User
// @access  Public
router.post(
  '/users',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  usersController.userRegistration
)

// @route   POST mytweet/api/login
// @desc    Authenticate user and get token(LOGIN)
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  usersController.userLogin
)

module.exports = router
