const { validationResult } = require('express-validator')
const Post = require('../models/Post')
const User = require('../models/User')
const Profile = require('../models/Profile')

// @ To CREATE A POST
var createPost = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await User.findById(req.user.id).select('-password')

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    })

    const post = await newPost.save()

    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ GET ALL THE POST
var getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    if (!posts) {
      return res.status(400).json({ msg: 'Post not found' })
    }

    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ GET POST BY ID
var getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(400).json({ msg: 'Post not found' })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ DELETE A POST
var deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    // check
    if (post.user.toString() != req.user.id) {
      return res.status(401).json({ msg: 'User not Authorized' })
    }

    await post.remove()
    res.json({ msg: 'Post Deleted' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ ADD LIKES IN A POST
var likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post already been liked
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already been liked' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ UNLIKE A POST
var unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post already been liked
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }

    // Get remove index
    const removeIndex = await post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found' })
    }
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ TO ADD THE COMMENT
var addComment = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    }

    post.comments.unshift(newComment)

    await post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ DELETE COMMENT FROM POST
var deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )

    // Make sure comment exits
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exits' })
    }

    // check comment belong to user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'user not Authorized' })
    }

    // Get remove Index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)

    post.save()

    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
}
