import React, { useState } from 'react'
import { Popup, Button } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'

function Message({ message, user, deleteMsg, bannerProfilePic, divRef, isMobile }) {
  const [deleteIcon, showDeleteIcon] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const ifYouSender = message.sender === user._id

  return (
    <div className="bubbleWrapper" ref={divRef}>
      <div
        className={ifYouSender ? 'inlineContainer own' : 'inlineContainer'}
        onClick={() => {
          ifYouSender && showDeleteIcon(!deleteIcon)
          setShowTime((prev) => !prev)
        }}
      >
        <img
          className={ifYouSender ? 'inlineIcon self' : 'inlineIcon'}
          src={ifYouSender ? user.profilePicUrl : bannerProfilePic}
        />

        <div className={ifYouSender ? 'ownBubble own' : 'otherBubble other'}>
          {message.msg}
        </div>
      </div>

      {((isMobile && showTime) || !isMobile) && (
        <span className={ifYouSender ? 'own' : 'other'}>
          {deleteIcon && (
            <Popup
              trigger={
                <Button
                  basic
                  size="mini"
                  compact
                  disabled={deleting}
                  loading={deleting}
                  onClick={() => {
                    setDeleting(true)
                    deleteMsg(message._id)
                  }}
                  style={{ margin: '0 7px 0', padding: '5px' }}
                  content="Delete"
                  negative
                />
              }
              content="This will only delete the message from your inbox!"
              position="top right"
            />
          )}
          {calculateTime(message.date)}
        </span>
      )}
    </div>
  )
}

export default Message
