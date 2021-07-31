import React from 'react'
import { Form, Segment, Image, Icon, Header, Button } from 'semantic-ui-react'

function ImageDropDiv({
  highlighted,
  setHighlighted,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia
}) {
  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
          />

          <div
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
              setHighlighted(true)

              const droppedFile = Array.from(e.dataTransfer.files)
              setMedia(droppedFile[0])
              setMediaPreview(URL.createObjectURL(droppedFile[0]))
            }}
          >
            {mediaPreview === null ? (
              <>
                <Segment
                  {...(highlighted && { color: 'green' })}
                  style={{ cursor: 'pointer' }}
                  placeholder
                  basic
                  onClick={() => inputRef.current.click()}
                >
                  <Header icon>
                    <Icon name="file image outline" />
                    Drag and drop or Click to upload image
                  </Header>
                </Segment>
              </>
            ) : (
              <>
                <Segment color="green" placeholder basic>
                  <Image
                    src={mediaPreview}
                    size="medium"
                    centered
                    style={{ cursor: 'pointer' }}
                    onClick={() => inputRef.current.click()}
                  />
                </Segment>
                <Button
                  content="Clear image"
                  color="red"
                  icon="delete"
                  basic
                  type="button"
                  onClick={() => {
                    setMedia(null)
                    setMediaPreview(null)
                  }}
                />
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  )
}

export default ImageDropDiv
