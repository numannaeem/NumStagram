import React, { useState } from 'react'
import { Feed, Button, Divider } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'
import { acceptRequest, rejectRequest } from '../../utils/profileActions'

function FollowRequestNotification({
  notification,
  loggedUserFollowStats,
  setUserFollowStats,
  setNotifs
}) {
  const [disabled, setDisabled] = useState(false)

  // const accepted =
  //   loggedUserFollowStats.followers.length > 0 &&
  //   loggedUserFollowStats.followers.filter((f) => f.user === notification.user._id)
  //     .length > 0

  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{' '}
              has requested to follow you.
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
        </Feed.Content>
        <div className="followRequestNotification">
          <Button
            size="small"
            compact
            negative
            content={'Decline'}
            disabled={disabled}
            onClick={async () => {
              setDisabled(true)
              await rejectRequest(notification.user._id)
              setNotifs((prev) => prev.filter((n) => n._id !== notification._id))
              setDisabled(false)
            }}
          />
          <Button
            size="small"
            compact
            color={'twitter'}
            content={'Accept'}
            disabled={disabled}
            onClick={async () => {
              setDisabled(true)
              await acceptRequest(notification.user._id, setUserFollowStats)
              setNotifs((prev) => prev.filter((n) => n._id !== notification._id))
              setDisabled(false)
            }}
          />
        </div>
      </Feed.Event>
      <Divider />
    </>
  )
}

export default FollowRequestNotification
