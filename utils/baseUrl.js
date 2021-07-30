const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://numstagram.herokuapp.com'
    : 'http://192.168.29.40:3000'

module.exports = baseUrl
