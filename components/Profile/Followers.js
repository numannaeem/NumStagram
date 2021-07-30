import React, { useState, useEffect } from 'react'
import { Button, Image, List } from 'semantic-ui-react'
import Spinner from '../Layout/Spinner'
import { NoFollowData } from '../Layout/NoData'
import { followUser, unfollowUser } from '../../utils/profileActions'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import cookie from 'js-cookie'

const Followers = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId
}) => {
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${baseUrl}/api/profile/followers/${profileUserId}`, {
          headers: { Authorization: cookie.get('token') }
        })

        setFollowers(res.data)
      } catch (error) {
        alert('Error loading followers. Please try again.')
      }
      setLoading(false)
    }

    getFollowers()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : followers.length > 0 ? (
        <List divided verticalAlign="middle">
          {followers.map((profileFollower) => {
            const isFollowing =
              loggedUserFollowStats.following.length > 0 &&
              loggedUserFollowStats.following.filter(
                (following) => following.user === profileFollower.user._id
              ).length > 0

            return (
              <List.Item key={profileFollower.user._id} style={{ padding: '0.5rem' }}>
                <List.Content floated="right">
                  {profileFollower.user._id !== user._id && (
                    <Button
                      size="small"
                      color={isFollowing ? 'instagram' : 'twitter'}
                      icon={isFollowing ? 'check' : 'add user'}
                      content={isFollowing ? 'Following' : 'Follow'}
                      disabled={followLoading}
                      onClick={() => {
                        setFollowLoading(true)

                        isFollowing
                          ? unfollowUser(profileFollower.user._id, setUserFollowStats)
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
          })}
        </List>
      ) : (
        <NoFollowData followersComponent={true} />
      )}
    </>
  )
}

export default Followers
