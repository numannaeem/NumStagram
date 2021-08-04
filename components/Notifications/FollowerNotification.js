import React, { useState } from 'react'
import { Feed, Button, Divider } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'
import { followUser, unfollowUser, sendRequest } from '../../utils/profileActions'

function FollowerNotification({
  user,
  notification,
  loggedUserFollowStats,
  setUserFollowStats
}) {
  const [followLoading, setFollowLoading] = useState(false)

  const [followRequestSent, setFollowRequestSent] = useState(
    user.followRequestsSent?.filter((r) => r === notification.user._id).length > 0
  )
  const privateAcc = notification.user.private

  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === notification.user._id
    ).length > 0

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
              started following you.
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
        </Feed.Content>
        <div style={{ alignSelf: 'flex-end', marginRight: '10px' }}>
          <Button
            size="small"
            color={isFollowing ? 'instagram' : 'twitter'}
            icon={
              isFollowing
                ? 'check circle'
                : followRequestSent
                ? 'clock outline'
                : 'add user'
            }
            content={
              isFollowing
                ? 'Following'
                : followRequestSent
                ? 'Follow request sent'
                : privateAcc
                ? 'Send follow request'
                : 'Follow'
            }
            disabled={followRequestSent || followLoading}
            onClick={() => {
              setFollowLoading(true)

              isFollowing
                ? unfollowUser(notification.user._id, setUserFollowStats)
                : privateAcc
                ? sendRequest(notification.user._id, setFollowRequestSent)
                : followUser(notification.user._id, setUserFollowStats)

              setFollowLoading(false)
            }}
          />
        </div>
      </Feed.Event>
      <Divider />
    </>
  )
}

export default FollowerNotification
