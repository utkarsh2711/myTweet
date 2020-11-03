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

// @route   GET mytweet/api/post
// @desc    Get All Posts
// @access  Private
router.get('/post', auth, postsController.getPosts)

// @route   GET mytweet/api/post/:id
// @desc    GET Post by id
// @access  Private
router.get('/post/:id', auth, postsController.getPostById)

// @route   DELETE mytweet/api/post/:id
// @desc    DELETE a Post
// @access  Private
router.delete('/post/:id', auth, postsController.deletePost)

// @route   POST mytweet/api/post/like/:id
// @desc    Add Likes in a post
// @access  Private
router.post('/post/like/:id', auth, postsController.likePost)

// @route   PUT mytweet/api/post/unlike/:id
// @desc    Unlike the post
// @access  Private
router.put('/post/unlike/:id', auth, postsController.unlikePost)

// @route   POST mytweet/api/post/comment/:id
// @desc    Create Post
// @access  Private
router.post(
  '/post/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postsController.addComment
)

// @route   DELETE mytweet/api/post/comment/:id/:comment_id
// @desc    Delete Comment
// @access  Private
router.delete(
  '/post/comment/:id/:comment_id',
  auth,
  postsController.deleteComment
)

module.exports = router
