const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://numstagram.herokuapp.com'
    : 'http://192.168.29.4:3000'

module.exports = baseUrl
