const withOffline = require('next-offline')

module.exports = withOffline({
  env: {
    CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/num4n/image/upload'
  }
})

// module.exports = {
//   env: {
//     CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/num4n/image/upload'
//   }
// }
