const express = require('express')

const profileController = require('../controllers/profileController')

const router = express.Router()

// @route   GET mytweet/api/profile
// @desc    Profile Route
// @access  Private
router.get('/profile', profileController.profileAPI)

module.exports = router
