const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://numstagram.herokuapp.com'
    : 'http://192.168.29.3:3000'

module.exports = baseUrl
