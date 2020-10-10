var postsAPI = (req, res) => {
  res.status(200).json({ msg: `Hello From Posts Controller` })
}

module.exports = {
  postsAPI,
}
