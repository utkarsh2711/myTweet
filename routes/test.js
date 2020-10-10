const express = require('express')
const router = express.Router()
const auth = require('../config/auth')

const testController = require('../controllers/testController')

// @route   GET mytweet/api/test
// @desc    Test Route
// @access  Public
router.get('/test', auth, testController.testAPI)

module.exports = router
