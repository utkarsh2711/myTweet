const Profile = require('../models/Profile')
const User = require('../models/User')
const { validationResult } = require('express-validator')
const request = require('request')
require('dotenv').config()

// @ Get The current User Profile
var myProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ CREATE USER PROFILE (Current User)
var createProfile = async (req, res) => {
  // Checking If there are validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
  } = req.body

  // Build Profile Object
  const profileFields = {}
  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim())
  }

  // Build Social Object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      return res.json(profile)
    }
    // Create
    profile = new Profile(profileFields)
    await profile.save()
    return res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ GET ALL PROFILES
var getProfiles = async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.send(profiles)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ GET PROFILE By USER ID
var getUserProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'Profile Not Found' })
    }
    res.send(profile)
  } catch (err) {
    console.error(err)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile Not Found' })
    }
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ DELETE POFILE, USER and POST
var deleteProfile = async (req, res) => {
  try {
    // @ToDo - Remove User posts

    // Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id })

    // Remove User
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ ADD EXPERIENCE to USER
var addExperience = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, company, location, from, to, current, description } = req.body

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    profile.experience.unshift(newExp)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ DELETE POFILE EXPERIENCE
var deleteExp = async (req, res) => {
  try {
    // Remove Profile
    const profile = await Profile.findOne({ user: req.user.id })

    // Get Remove Index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ ADD EDUCATION TO USER PROFILE
var addEducation = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    profile.education.unshift(newEdu)

    await profile.save()

    res.send(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ DELETE EDUCATIOn FROM USER PROFILE
var deleteEducation = async (req, res) => {
  try {
    // Remove Profile
    const profile = await Profile.findOne({ user: req.user.id })

    // Get Remove Index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

// @ GET GIT HUB REPOSITORY FOR THE USER
var getGitHubRepo = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc
      &client_id=${process.env.GIT_HUB_CLIENT_ID}&client_secret=${process.env.GIT_HUB_CLIENT_SECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode != 200) {
        return res.status(400).json({ msg: 'No Git Hub Profile Found' })
      }

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}

module.exports = {
  myProfile,
  createProfile,
  getProfiles,
  getUserProfile,
  deleteProfile,
  addExperience,
  deleteExp,
  addEducation,
  deleteEducation,
  getGitHubRepo,
}
