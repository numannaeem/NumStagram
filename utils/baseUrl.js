const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://www.numstagram.numxn.me'
    : 'http://localhost:3000'

module.exports = baseUrl
