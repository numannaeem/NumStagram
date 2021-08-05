import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Message, Segment, Divider } from 'semantic-ui-react'
import CommonInputs from '../components/Common/CommonInputs'
import { HeaderMessage, FooterMessage } from '../components/Common/WelcomeMessage'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { registerUser } from '../utils/authUser'
import uploadPic from '../utils/uploadPicToCloudinary'
import SignupImage from '../components/Common/SignupImage'
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/
let cancel

function Signup() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
    username: ''
  })

  const { name, email, password, bio } = user

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'media') {
      setMedia(files[0] || null)
      setMediaPreview(files[0] ? URL.createObjectURL(files[0]) : null)
    }

    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const [showSocialLinks, setShowSocialLinks] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const [username, setUsername] = useState('')
  const [usernameLoading, setUsernameLoading] = useState(false)
  const [usernameState, setUsernameState] = useState({ valid: true, error: null })

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const [highlighted, setHighlighted] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    const isUser = Object.values({ name, email, password }).every((item) => Boolean(item))
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true)
  }, [user])

  useEffect(() => {
    errorMsg && window.scroll(0, 0)
  }, [errorMsg])

  useEffect(() => {
    if (username === '') {
      setUsernameState({ valid: false, error: 'Username cannot be empty' })
    } else {
      setUsernameState({ valid: true, error: null })
      if (regexUserName.test(username)) {
        setUsernameLoading(true)

        cancel && cancel()

        const CancelToken = axios.CancelToken

        axios
          .get(`${baseUrl}/api/signup/${username}`, {
            cancelToken: new CancelToken((canceler) => {
              cancel = canceler
            })
          })
          .then((res) => {
            if (res.data === 'Available') {
              setUsernameState({ valid: true, error: null })
              setUser((prev) => ({ ...prev, username }))
            }
          })
          .catch((err) => {
            setUsernameState({ valid: false, error: 'Username already taken' })
          })
          .finally(() => {
            setUsernameLoading(false)
          })
      } else {
        setUsernameState({
          valid: false,
          error: 'Special characters not allowed'
        })
      }
    }
  }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    let profilePicUrl
    if (media !== null) {
      profilePicUrl = await uploadPic(media)
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false)
      window.scrollTo(0, 0)
      return setErrorMsg('Error Uploading Image')
    }

    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading)
  }

  return (
    <>
      <HeaderMessage />
      <Form loading={formLoading} error={errorMsg !== null} onSubmit={handleSubmit}>
        <Message
          error
          header="Oops!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />

        <Segment>
          <SignupImage
            inputRef={inputRef}
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            required
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />

          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: 'eye',
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword)
            }}
            iconPosition="left"
            type={showPassword ? 'text' : 'password'}
            required
          />

          <Form.Input
            loading={usernameLoading}
            error={usernameState.error}
            required
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
            }}
            fluid
            icon={usernameState.valid ? 'check' : 'close'}
            iconPosition="left"
          />

          <CommonInputs
            user={user}
            showSocialLinks={showSocialLinks}
            setShowSocialLinks={setShowSocialLinks}
            handleChange={handleChange}
          />
          <hr style={{ opacity: '0' }} />
          <Button
            content="Sign up"
            type="submit"
            color="purple"
            disabled={submitDisabled || username === '' || !usernameState.valid}
          />
        </Segment>
      </Form>

      <FooterMessage />
    </>
  )
}

export default Signup
