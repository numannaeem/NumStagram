import { Message, Button } from 'semantic-ui-react'

export const NoProfilePosts = () => (
  <div>
    <Message
      info
      icon="toggle off"
      header="Nothing here!"
      content="User hasn't posted anything yet"
    />
    <Button icon="long arrow alternate left" content="Go Back" as="a" href="/" />
  </div>
)

export const PrivateBanner = () => (
  <div>
    <Message
      warning
      icon="eye slash outline"
      header="Private Account"
      content="Follow them to view their posts"
    />
    <Button icon="long arrow alternate left" content="Go Back" as="a" href="/" />
  </div>
)

export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <div>
    {followersComponent && (
      <Message icon="user outline" info content={`User does not have any followers`} />
    )}

    {followingComponent && (
      <Message icon="user outline" info content={`User does not follow anyone`} />
    )}
  </div>
)

export const NoMessages = () => (
  <Message
    info
    icon="telegram plane"
    header="Whoops!"
    content="You haven't messaged anyone yet. Search below to find someone!"
  />
)

export const NoPosts = () => (
  <div>
    <Message
      info
      icon="meh"
      header="It's lonely in here..."
      content="Follow someone to see what they're up to!"
    />
  </div>
)

export const NoProfile = () => (
  <div style={{ minHeight: '100vh' }}>
    <Message
      info
      icon="terminal"
      header="No profile found"
      content="Seems like you're lost..."
    />
  </div>
)

export const NoNotifications = () => (
  <div>
    <Message content="No Notifications" icon="smile" info />
  </div>
)

export const NoPostFound = () => (
  <div style={{ minHeight: '100vh' }}>
    <Message
      info
      icon="terminal"
      header="No post found"
      content="You sure you're in the right place?"
    />
  </div>
)
