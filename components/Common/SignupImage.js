import React, { useState, useEffect, useRef } from 'react'
import { Form, Header, Grid, Segment, Icon, Button, ButtonGroup } from 'semantic-ui-react'
import Cropper from 'react-cropper'

function SignupImage({
  highlighted,
  setHighlighted,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
  inputRef
}) {
  let cropref = useRef()
  const [cropper, setCropper] = useState(null)

  useEffect(() => {
    if (!cropper) {
      return
    }
    function handleRPress(e) {
      if (e.key === 'r') {
        cropper?.reset()
      }
    }
    window.addEventListener('keydown', handleRPress)

    return () => window.removeEventListener('keydown', handleRPress)
  }, [cropper])
  return (
    <>
      <Form.Field>
        <Segment basic secondary>
          <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
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
                  onClick={() => inputRef.current?.click()}
                >
                  <Header icon>
                    <Icon name="file image outline" />
                    Click to upload
                    <br />
                    <small>or drop an image</small>
                  </Header>
                </Segment>
              </>
            ) : (
              <>
                <Segment style={{ padding: '0' }} basic padded={false}>
                  <Grid stackable columns={2}>
                    <Grid.Column>
                      <Cropper
                        style={{ height: '400px', width: '100%' }}
                        zoom={false}
                        dragMode="move"
                        aspectRatio={1}
                        preview=".img-preview"
                        src={mediaPreview}
                        viewMode={1}
                        minCropBoxHeight={50}
                        minContainerWidth={50}
                        background={false}
                        autoCropArea={1}
                        data
                        autoCrop
                        onInitialized={(cropper) => {
                          setCropper(cropper)
                          cropref = cropper
                        }}
                        ready={() => {
                          setMedia(cropref.getCroppedCanvas().toDataURL())
                        }}
                        cropend={() => {
                          setMedia(cropref.getCroppedCanvas().toDataURL())
                        }}
                      />
                    </Grid.Column>

                    <Grid.Column>
                      <div>
                        <h2>Preview</h2>

                        <div
                          style={{
                            borderRadius: '50%',
                            width: '300px',
                            height: '300px',
                            display: 'inline-block',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            border: '2px solid darkgray'
                          }}
                          className="img-preview"
                        />
                      </div>
                    </Grid.Column>
                  </Grid>
                </Segment>
                <div>
                  <Button
                    basic
                    title="Reset (R)"
                    icon="redo"
                    onClick={() => cropper?.reset()}
                    type="button"
                  />
                  <Button
                    inverted
                    content="New image"
                    color="orange"
                    icon="image"
                    type="button"
                    onClick={() => {
                      inputRef.current?.click()
                    }}
                  />
                  <Button
                    style={{ marginTop: '5px', marginBottom: '5px' }}
                    inverted
                    content="Remove image"
                    color="red"
                    icon="delete"
                    type="button"
                    onClick={() => {
                      setMedia(null)
                      setMediaPreview(null)
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  )
}

export default SignupImage
