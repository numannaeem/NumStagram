import React, { useState, useEffect } from 'react'
import { Button, Image, List } from 'semantic-ui-react'
import Spinner from '../Layout/Spinner'
import { NoFollowData } from '../Layout/NoData'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import cookie from 'js-cookie'
import Follower from './Follower'

const Following = ({
  user,
  loggedUserFollowStats,
  setUserFollowStats,
  profileUserId
}) => {
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${baseUrl}/api/profile/following/${profileUserId}`, {
          headers: { Authorization: cookie.get('token') }
        })

        setFollowing(res.data)
      } catch (error) {
        alert('Error Loading Followers')
      }
      setLoading(false)
    }

    getFollowing()
  }, [])

  return (
    <>
      {loading ? (
        <Spinner />
      ) : following.length > 0 ? (
        <List divided verticalAlign="middle">
          {following.map((profileFollowing) => (
            <Follower
              setUserFollowStats={setUserFollowStats}
              profileFollower={profileFollowing}
              user={user}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          ))}
        </List>
      ) : (
        <NoFollowData followingComponent={true} />
      )}
    </>
  )
}

export default Following
