import axios from 'axios'

const uploadPic = async (media) => {
  try {
    const form = new FormData()
    form.append('file', media)
    form.append('upload_preset', 'social_media_app')
    form.append('cloud_name', 'num4n')

    const res = await axios.post(process.env.CLOUDINARY_URL, form)
    return res.data.url
  } catch (error) {
    return null
  }
}

export const uploadAvatar = async (media) => {
  try {
    const form = new FormData()
    form.append('file', media)
    form.append('upload_preset', 'numstagram_avatar')
    form.append('cloud_name', 'num4n')

    const res = await axios.post(process.env.CLOUDINARY_URL, form)
    return res.data.url
  } catch (error) {
    return null
  }
}

export default uploadPic
