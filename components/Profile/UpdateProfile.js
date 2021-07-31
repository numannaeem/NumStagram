import React, { useState, useRef } from 'react'
import { Form, Button, Message, Divider } from 'semantic-ui-react'
import CommonInputs from '../Common/CommonInputs'
import SignupImage from '../Common/SignupImage'
import uploadPic from '../../utils/uploadPicToCloudinary'
import { profileUpdate } from '../../utils/profileActions'

function UpdateProfile({ Profile }) {
  const userPng =
    'https://res.cloudinary.com/num4n/image/upload/v1625750805/user_mklcpl_n86ya3.png'

  const [profile, setProfile] = useState({
    profilePicUrl: Profile.user.profilePicUrl,
    bio: Profile.bio || '',
    facebook: Profile.social?.facebook || '',
    youtube: Profile.social?.youtube || '',
    instagram: Profile.social?.instagram || '',
    twitter: Profile.social?.twitter || ''
  })

  const [errorMsg, setErrorMsg] = useState(null)

  const [loading, setLoading] = useState(false)
  const [showSocialLinks, setShowSocialLinks] = useState(false)

  const [highlighted, setHighlighted] = useState(false)
  const inputRef = useRef()
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(
    profile.profilePicUrl === userPng ? null : profile.profilePicUrl
  )

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'media') {
      setMedia(files[0] || null)
      setMediaPreview(files[0] ? URL.createObjectURL(files[0]) : null)
    }
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <Form
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)

          let profilePicUrl = null
          if (mediaPreview === profile.profilePicUrl) {
            profilePicUrl = profile.profilePicUrl
          } else if (mediaPreview !== null) {
            profilePicUrl = await uploadPic(media)
          }

          if (mediaPreview !== null && !profilePicUrl) {
            setLoading(false)
            return setErrorMsg('Error Uploading Image')
          }

          await profileUpdate(profile, setLoading, setErrorMsg, profilePicUrl)
        }}
      >
        <Message
          onDismiss={() => setErrorMsg(false)}
          error
          content={errorMsg}
          attached
          header="Oops!"
        />

        <SignupImage
          inputRef={inputRef}
          mediaPreview={mediaPreview}
          setMediaPreview={setMediaPreview}
          setMedia={setMedia}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          handleChange={handleChange}
        />

        <CommonInputs
          user={profile}
          handleChange={handleChange}
          showSocialLinks={showSocialLinks}
          setShowSocialLinks={setShowSocialLinks}
        />
        <br />
        <br />
        <Button
          color="green"
          icon="save"
          disabled={profile.bio === '' || loading}
          content="Save changes"
          type="submit"
        />
      </Form>
    </>
  )
}

export default UpdateProfile
