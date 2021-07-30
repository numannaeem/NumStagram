import React from 'react'
import { Modal, Image } from 'semantic-ui-react'

function ImageOnlyModal({ picUrl }) {
  return (
    <div style={{ padding: '10px' }}>
      <Modal.Content image>
        <Image fluid centered src={picUrl} />
      </Modal.Content>
    </div>
  )
}

export default ImageOnlyModal
