import React, { useState, useRef } from 'react'
import { Form, Button, Image, Divider, Message, Icon, Input } from 'semantic-ui-react'
import uploadPic from '../../utils/uploadPicToCloudinary'
import { submitNewPost } from '../../utils/postActions'

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: '', location: '' })
  const [loading, setLoading] = useState(false)
  let inputRef = useRef()

  const [error, setError] = useState(null)
  const [highlighted, setHighlighted] = useState(false)

  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)

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
    maxWidth: '300px',
    border: !media && '1px darkgray solid',
    borderRadius: '5px',
    paddingTop: !media && '60px',
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
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message error onDismiss={() => setError(null)} content={error} header="Oops!" />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="What's happening?"
            name="text"
            required
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group grouped>
          <Form.Input
            style={{ maxWidth: '300px' }}
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add Location"
            icon="map marker alternate"
            placeholder="Want to add a location?"
          />

          {/* <Form.Input
            label="Upload an image"
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
          /> */}
          <Form.Field>
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
              console.log(inputRef)
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
              <>
                <Image src={mediaPreview} alt="PostImage" centered />
              </>
            )}
          </div>
        </Form.Group>

        <Divider hidden />
        <Button
          circular
          disabled={!newPost.text.trim().length || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: '#1DA1F2', color: 'white' }}
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  )
}

export default CreatePost
