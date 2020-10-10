const express = require('express')

const postsController = require('../controllers/postsController')

const router = express.Router()

// @route   GET mytweet/api/post
// @desc    Posts Route
// @access  Public
router.get('/posts', postsController.postsAPI)

module.exports = router
