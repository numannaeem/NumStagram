import React, { useState } from 'react'
import { List, Button, Image } from 'semantic-ui-react'
import { followUser, sendRequest, unfollowUser } from '../../utils/profileActions'

function Follower({ profileFollower, loggedUserFollowStats, user, setUserFollowStats }) {
  const [followLoading, setFollowLoading] = useState(false)
  const [followRequestSent, setFollowRequestSent] = useState(
    user.followRequestsSent?.filter((r) => r === profileFollower.user._id).length > 0
  )
  const privateAcc = profileFollower.user.private
  const isFollowing =
    loggedUserFollowStats.following?.filter(
      (following) => following.user === profileFollower.user._id
    ).length > 0
  return (
    <List.Item key={profileFollower.user._id} style={{ padding: '0.5rem' }}>
      <List.Content floated="right">
        {profileFollower.user._id !== user._id && (
          <Button
            size="small"
            color={isFollowing ? 'instagram' : followRequestSent ? 'black' : 'twitter'}
            content={
              isFollowing
                ? 'Following'
                : !privateAcc
                ? 'Follow'
                : followRequestSent
                ? 'Request sent'
                : 'Send follow request'
            }
            icon={
              isFollowing
                ? 'check circle'
                : privateAcc && followRequestSent
                ? 'clock outline'
                : 'add user'
            }
            disabled={(privateAcc && followRequestSent) || followLoading}
            onClick={() => {
              setFollowLoading(true)

              isFollowing
                ? unfollowUser(profileFollower.user._id, setUserFollowStats)
                : privateAcc
                ? sendRequest(profileFollower.user._id, setFollowRequestSent)
                : followUser(profileFollower.user._id, setUserFollowStats)

              setFollowLoading(false)
            }}
          />
        )}
      </List.Content>
      <Image avatar src={profileFollower.user.profilePicUrl} />
      <List.Content as="a" href={`/${profileFollower.user.username}`}>
        {profileFollower.user.name}
      </List.Content>
    </List.Item>
  )
}

export default Follower
