import React, { useState, useRef, useEffect } from 'react'
import {
  Form,
  Button,
  Image,
  Message,
  Icon,
  Transition,
  Grid,
  Container,
  Divider
} from 'semantic-ui-react'
import uploadPic from '../../utils/uploadPicToCloudinary'
import { submitNewPost } from '../../utils/postActions'
import Moment from 'react-moment'

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)
  let inputRef = useRef()

  const [error, setError] = useState(null)
  const [highlighted, setHighlighted] = useState(false)

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)

  useEffect(() => {
    if (!touched) {
      return
    }
    function handleEscPress(e) {
      if (e.key === 'Escape') {
        setTouched(false)
      }
    }
    window.addEventListener('keydown', handleEscPress)

    return () => window.removeEventListener('keydown', handleEscPress)
  }, [touched])

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === 'media') {
      setMedia(files[0] || null)
      setMediaPreview(files[0] ? URL.createObjectURL(files[0]) : null)
    }

    setNewPost((prev) => ({ ...prev, [name]: value }))
  }

  const addStyles = () => ({
    textAlign: 'center',
    minHeight: '150px',
    width: '100%',
    maxWidth: '400px',
    border: !media && '1px rgb(34,36,38,.15) solid',
    color: 'rgb(34,36,38,.75)',
    borderRadius: '5px',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: !media && highlighted ? 'lightgray' : 'white'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    let picUrl

    if (media !== null) {
      picUrl = await uploadPic(media)
      if (!picUrl) {
        setLoading(false)
        return setError('Error uploading image')
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    )

    setMedia(null)
    setMediaPreview(null)
    setLoading(false)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div
        style={{
          margin: '0.3rem 0 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={() => setTouched((prev) => !prev)}
      >
        <Image style={{ marginRight: '0.4rem' }} src={user.profilePicUrl} avatar />
        <big>
          Hi, {user.username} | <Moment interval={1000} format="hh:mm A" />
        </big>
        <Icon size="large" color="grey" name={`angle ${touched ? 'up' : 'down'}`} />
      </div>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message error onDismiss={() => setError(null)} content={error} header="Oops!" />

        <Form.Group>
          <Form.TextArea
            placeholder="What's happening?"
            name="text"
            required
            value={newPost.text}
            onChange={(e) => {
              !touched && setTouched(true)
              handleChange(e)
            }}
            rows={4}
            width={16}
          />
        </Form.Group>

        <Transition.Group animation="fade down" duration={{ hide: 300, show: 600 }}>
          {touched && (
            <Container fluid>
              <Grid
                style={{ marginBottom: '0.3rem' }}
                columns={2}
                stackable
                padded={false}
              >
                <Grid.Column>
                  <Form.Input
                    fluid
                    value={newPost.location}
                    name="location"
                    onChange={handleChange}
                    label="Add Location"
                    icon="map marker alternate"
                    placeholder="Location"
                  />
                </Grid.Column>
                <Grid.Column>
                  <div>
                    <Form.Field style={{ marginBottom: '0' }}>
                      <label>Upload an image</label>
                      <input
                        type="file"
                        accept="image/*"
                        name="media"
                        ref={inputRef}
                        style={{ display: 'none' }}
                        onChange={handleChange}
                      />
                    </Form.Field>

                    <div
                      onClick={() => {
                        inputRef.current.click()
                      }}
                      style={addStyles()}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setHighlighted(true)
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault()
                        setHighlighted(false)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        setHighlighted(false)

                        const droppedFile = Array.from(e.dataTransfer.files)

                        if (droppedFile[0]) {
                          setMedia(droppedFile[0])
                          setMediaPreview(URL.createObjectURL(droppedFile[0]))
                        }
                      }}
                    >
                      {media === null ? (
                        <>
                          <Icon name="plus" size="small" />
                          <span>Add image</span>
                        </>
                      ) : (
                        <div>
                          <Image src={mediaPreview} alt="PostImage" centered />
                        </div>
                      )}
                    </div>
                  </div>
                </Grid.Column>
              </Grid>
            </Container>
          )}
        </Transition.Group>
        <div
          style={{
            marginLeft: 'auto',
            display: 'block',
            width: 'fit-content'
          }}
        >
          {media && (
            <Button
              content="Remove image"
              color="red"
              icon="delete"
              type="button"
              onClick={() => {
                setMedia(null)
                setMediaPreview(null)
              }}
            />
          )}
          <Button.Group style={{ marginRight: '5px' }}>
            <Button
              content="Cancel"
              disabled={(!media && !newPost.text.trim().length) || loading}
              onClick={() => {
                setMedia(null)
                setMediaPreview(null)
                setNewPost({ text: '', location: '' })
                setTouched(false)
              }}
            />

            <Button.Or />

            <Button
              disabled={!newPost.text.trim().length || loading}
              content={<strong>Post</strong>}
              color="teal"
              icon="send"
              loading={loading}
            />
          </Button.Group>
        </div>
        <br />
      </Form>
    </>
  )
}

export default CreatePost
