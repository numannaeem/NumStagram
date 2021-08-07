import React from 'react'
import { Divider, Feed } from 'semantic-ui-react'
import Link from 'next/link'
import calculateTime from '../../utils/calculateTime'

function ReplyNotification({ notification }) {
  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as={Link} href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{' '}
              replied to you comment on{' '}
              <Link href={`/post/${notification.post._id}`}>this post.</Link>
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>

          {notification.post.picUrl && (
            <Feed.Extra images>
              <a href={`/post/${notification.post._id}`}>
                <img src={notification.post.picUrl} />
              </a>
            </Feed.Extra>
          )}
          <Feed.Extra text>
            <p>{notification.text}</p>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  )
}

export default ReplyNotification
