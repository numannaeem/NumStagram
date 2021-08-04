import React, { useState, useEffect } from 'react'
import { Button, Image, List } from 'semantic-ui-react'
import Spinner from '../Layout/Spinner'
import { NoFollowData } from '../Layout/NoData'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import cookie from 'js-cookie'
import Follower from './Follower'

const Followers = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId
}) => {
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(false)

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
          {followers.map((profileFollower) => (
            <Follower
              setUserFollowStats={setUserFollowStats}
              profileFollower={profileFollower}
              user={user}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          ))}
        </List>
      ) : (
        <NoFollowData followersComponent={true} />
      )}
    </>
  )
}

export default Followers
