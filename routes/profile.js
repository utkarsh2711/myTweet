const express = require('express')
const auth = require('../config/auth')
const { check, validationResult } = require('express-validator')

const profileController = require('../controllers/profileController')

const router = express.Router()

// @route   GET mytweet/api/profile/me
// @desc    Get the current user profile
// @access  Private
router.get('/profile/me', auth, profileController.myProfile)

// @route   POST mytweet/api/profile
// @desc    Create or Update Current User Profile
// @access  Private
router.post(
  '/profile',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  profileController.createProfile
)

// @route   GET mytweet/api/profile
// @desc    Get all profiles
// @access  Public
router.get('/profile', profileController.getProfiles)

// @route   GET mytweet/api/profile/user/:user_id
// @desc    Get Profile by User ID
// @access  Public
router.get('/profile/user/:user_id', profileController.getUserProfile)

// @route   DELETE mytweet/api/profile
// @desc    Delete profile, user and Post
// @access  Private
router.delete('/profile', auth, profileController.deleteProfile)

// @route   PUT mytweet/api/profile/experience
// @desc    ADD profile experience
// @access  Private
router.put(
  '/profile/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  profileController.addExperience
)

// @route   DELETE mytweet/api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/profile/experience/:exp_id', auth, profileController.deleteExp)

// @route   PUT mytweet/api/profile/education
// @desc    ADD profile education
// @access  Private
router.put(
  '/profile/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
    ],
  ],
  profileController.addEducation
)

// @route   DELETE mytweet/api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  '/profile/education/:edu_id',
  auth,
  profileController.deleteEducation
)

// @route   GET mytweet/api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/profile/github/:username', profileController.getGitHubRepo)

module.exports = router
