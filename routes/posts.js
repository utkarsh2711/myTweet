const express = require('express')
const auth = require('../config/auth')
const { check, validationResult } = require('express-validator')

const router = express.Router()

const postsController = require('../controllers/postsController')

// @route   POST mytweet/api/post
// @desc    Create Post
// @access  Private
router.post(
  '/post',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postsController.createPost
)

module.exports = router
