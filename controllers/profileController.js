var profileAPI = (req, res) => {
  res.status(200).json({ msg: `Hello From Profile Controller` })
}

module.exports = {
  profileAPI,
}
