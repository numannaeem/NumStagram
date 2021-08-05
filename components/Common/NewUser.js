import React, { useState } from 'react'
import { calculateDays } from '../../utils/calculateTime'
import { List, Image, Button } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import { followUser, sendRequest, unfollowUser } from '../../utils/profileActions'

function NewUser({ user, loggedUser, loggedUserFollowStats, setUserFollowStats }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [followRequestSent, setFollowRequestSent] = useState(
    loggedUser.followRequestsSent?.filter((r) => r === user._id).length > 0
  )
  const privateAcc = user.private

  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter((following) => following.user === user._id)
      .length > 0

  return (
    <List.Item
      key={user._id}
      title="View Profile"
      style={{ cursor: 'pointer' }}
      onClick={() => {
        router.push(`/${user.username}`)
      }}
    >
      <Image src={user.profilePicUrl} avatar />
      <List.Content>
        <List.Header content={user.name} />
        <List.Description as="small" style={{ color: 'gray' }}>
          Joined {calculateDays(user.createdAt)}
        </List.Description>
      </List.Content>
      <List.Content style={{ marginTop: '0.5rem' }}>
        {!isFollowing && (
          <Button
            title={
              isFollowing
                ? 'Following'
                : followRequestSent
                ? 'Follow request sent'
                : privateAcc
                ? 'Send follow request'
                : 'Follow'
            }
            compact
            size="small"
            loading={loading}
            disabled={loading || (privateAcc && followRequestSent)}
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
            color={isFollowing ? 'instagram' : 'blue'}
            onClick={async (e) => {
              e.stopPropagation()
              setLoading(true)
              isFollowing
                ? await unfollowUser(user._id, setUserFollowStats)
                : privateAcc
                ? await sendRequest(user._id, setFollowRequestSent)
                : await followUser(user._id, setUserFollowStats)
              setLoading(false)
            }}
          />
        )}
        <Button
          title="Message"
          onClick={(e) => {
            router.push(`/messages?message=${user._id}`)
            e.stopPropagation()
          }}
          icon="comment outline"
          color="teal"
          basic
          compact
          size="small"
          content="Message"
        />
      </List.Content>
    </List.Item>
  )
}

export default NewUser
