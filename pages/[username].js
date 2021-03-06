import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { Divider, Grid, Segment } from 'semantic-ui-react'
import { NoProfilePosts, NoProfile, PrivateBanner } from '../components/Layout/NoData'
import CardPost from '../components/Post/CardPost'
import cookie from 'js-cookie'
import { PlaceHolderPosts } from '../components/Layout/PlaceHolderGroup'
import ProfileMenuTabs from '../components/Profile/ProfileMenuTabs'
import ProfileHeader from '../components/Profile/ProfileHeader'
import Followers from '../components/Profile/Followers'
import Following from '../components/Profile/Following'
import UpdateProfile from '../components/Profile/UpdateProfile'
import Settings from '../components/Profile/Settings'
import { PostDeleteToastr } from '../components/Layout/Toastr'

function ProfilePage({
  errorLoading,
  profile,
  followersLength,
  followingLength,
  user,
  userFollowStats
}) {
  if (errorLoading) {
    return (
      <Segment style={{ borderTop: 'none' }}>
        <NoProfile />
      </Segment>
    )
  }
  const router = useRouter()

  const [posts, setPosts] = useState([])
  const [privateAcc, setPrivateAcc] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showToastr, setShowToastr] = useState(false)
  const [followRequestSent, setFollowRequestSent] = useState(
    Boolean(user.followRequestsSent?.filter((r) => r === profile.user._id).length)
  )

  const [activeItem, setActiveItem] = useState('profile')
  const handleItemClick = (clickedTab) => setActiveItem(clickedTab)

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats)

  const ownAccount = profile.user._id === user._id
  useEffect(() => {
    setPrivateAcc(true)
    setPosts([])
    setFollowRequestSent(
      Boolean(user.followRequestsSent?.filter((r) => r === profile.user._id).length)
    )
    setActiveItem('profile')
    const getPosts = async () => {
      setLoading(true)

      try {
        const { username } = router.query
        const res = await axios.get(`${baseUrl}/api/profile/posts/${username}`, {
          headers: { Authorization: cookie.get('token') }
        })
        if (res.data !== 'Private account') {
          setPrivateAcc(false)
          setPosts(res.data)
        }
      } catch (error) {
        alert('Error loading posts')
      }

      setLoading(false)
    }
    getPosts()
  }, [router.query.username])

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 4000)
  }, [showToastr])

  return (
    <Segment style={{ borderTop: 'none', minHeight: '100vh' }}>
      {showToastr && <PostDeleteToastr />}

      <Grid stackable>
        <Grid.Row>
          <ProfileMenuTabs
            activeItem={activeItem}
            handleItemClick={handleItemClick}
            followersLength={followersLength}
            followingLength={followingLength}
            ownAccount={ownAccount}
            loggedUserFollowStats={loggedUserFollowStats}
          />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === 'profile' && (
              <>
                <ProfileHeader
                  followRequestSent={followRequestSent}
                  setFollowRequestSent={setFollowRequestSent}
                  privateAcc={privateAcc}
                  setPrivateAcc={setPrivateAcc}
                  profile={profile}
                  ownAccount={ownAccount}
                  loggedUserFollowStats={loggedUserFollowStats}
                  setUserFollowStats={setUserFollowStats}
                />
                <Divider hidden />
                {loading ? (
                  <PlaceHolderPosts />
                ) : privateAcc && !ownAccount ? (
                  <PrivateBanner />
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <CardPost
                      key={post._id}
                      post={post}
                      user={user}
                      setPosts={setPosts}
                      setShowToastr={setShowToastr}
                    />
                  ))
                ) : (
                  <NoProfilePosts />
                )}
              </>
            )}

            {activeItem === 'followers' && (
              <Followers
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === 'following' && (
              <Following
                user={user}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile.user._id}
              />
            )}

            {activeItem === 'updateProfile' && <UpdateProfile Profile={profile} />}

            {activeItem === 'settings' && (
              <Settings
                visibility={user.private}
                newMessageSound={user.newMessageSound}
                newMessagePopup={user.newMessagePopup}
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  )
}

ProfilePage.getInitialProps = async (ctx) => {
  try {
    const { username } = ctx.query
    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
      headers: { Authorization: token }
    })

    const { profile, followersLength, followingLength } = res.data

    return { profile, followersLength, followingLength }
  } catch (error) {
    return { errorLoading: true }
  }
}

export default ProfilePage
