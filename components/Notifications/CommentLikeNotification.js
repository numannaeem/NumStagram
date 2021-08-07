import Link from 'next/link'
import React from 'react'
import { Divider, Feed } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'

function CommentLikeNotification({ notification }) {
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
              liked your comment on{' '}
              <Link href={`/post/${notification.post._id}`}>this post.</Link>
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          <Feed.Extra text>
            <p>{notification.text}</p>
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  )
}

export default CommentLikeNotification
