import React from 'react'
import Link from 'next/link'
import { Feed, Divider } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'

function LikeNotification({ notification }) {
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
              liked your <Link href={`/post/${notification.post._id}`}>post.</Link>
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
        </Feed.Content>
      </Feed.Event>
      <Divider />
    </>
  )
}

export default LikeNotification
