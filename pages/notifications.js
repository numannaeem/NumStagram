import React, { useEffect, useState } from 'react'
import { Feed, Segment, Divider, Container, Button } from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import cookie from 'js-cookie'
import { NoNotifications } from '../components/Layout/NoData'
import LikeNotification from '../components/Notifications/LikeNotification'
import CommentNotification from '../components/Notifications/CommentNotification'
import FollowerNotification from '../components/Notifications/FollowerNotification'
import ReplyNotification from '../components/Notifications/ReplyNotification'
import FollowRequestNotification from '../components/Notifications/FollowRequestNotification'
import CommentLikeNotification from '../components/Notifications/CommentLikeNotification'

function Notifications({ user, notifications, userFollowStats }) {
  const [notifs, setNotifs] = useState(notifications)
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const notificationsRead = async () => {
      try {
        await axios.post(
          `${baseUrl}/api/notifications`,
          {},
          { headers: { Authorization: cookie.get('token') } }
        )
      } catch (error) {
        alert(error)
      }
    }

    notificationsRead()
  }, [])

  const clearNotifications = async () => {
    try {
      await axios.delete(`${baseUrl}/api/notifications`, {
        headers: { Authorization: cookie.get('token') }
      })
      setNotifs((prev) => prev.filter((n) => n.type === 'newFollowRequest'))
    } catch (error) {
      alert(error)
    }
  }

  return (
    <>
      <Container style={{ marginTop: '1.5rem' }}>
        {notifs.length > 0 ? (
          <Segment color="teal" raised>
            <div
              style={{
                minHeight: '80vh',
                overflow: 'auto',
                position: 'relative',
                width: '100%'
              }}
            >
              <Feed size="small">
                {notifs.map((notification) => {
                  if (notification.type === 'newLike' && notification.post !== null)
                    return (
                      <LikeNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )
                  else if (
                    notification.type === 'newComment' &&
                    notification.post !== null
                  )
                    return (
                      <CommentNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )
                  else if (notification.type === 'newFollower')
                    return (
                      <FollowerNotification
                        user={user}
                        key={notification._id}
                        notification={notification}
                        loggedUserFollowStats={loggedUserFollowStats}
                        setUserFollowStats={setUserFollowStats}
                      />
                    )
                  else if (notification.type === 'newReply')
                    return (
                      <ReplyNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )
                  else if (notification.type === 'newFollowRequest')
                    return (
                      <FollowRequestNotification
                        key={notification._id}
                        notification={notification}
                        setUserFollowStats={setUserFollowStats}
                        setNotifs={setNotifs}
                      />
                    )
                  else if (notification.type === 'newCommentLike')
                    return (
                      <CommentLikeNotification
                        key={notification._id}
                        notification={notification}
                      />
                    )
                })}
              </Feed>
              {notifs.filter((n) => n.type !== 'newFollowRequest').length > 0 && (
                <Button
                  disabled={deleting}
                  inverted
                  size="small"
                  compact
                  icon="delete"
                  color="red"
                  content="Clear all"
                  onClick={async () => {
                    setDeleting(true)
                    await clearNotifications()
                    setDeleting(false)
                  }}
                />
              )}
            </div>
          </Segment>
        ) : (
          <Segment basic style={{ paddingTop: '0', minHeight: '100vh' }}>
            <NoNotifications />
          </Segment>
        )}
        <Divider hidden />
      </Container>
    </>
  )
}

Notifications.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/notifications`, {
      headers: { Authorization: token }
    })

    return { notifications: res.data }
  } catch (error) {
    return { errorLoading: true }
  }
}

export default Notifications
