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
    window.addEventListener('keydown', ({ key }) => {
      if (key === 'r') {
        cropper?.reset()
      }
    })
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
