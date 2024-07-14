const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://numstagram.onrender.com'
    : 'http://localhost:3000'

module.exports = baseUrl
