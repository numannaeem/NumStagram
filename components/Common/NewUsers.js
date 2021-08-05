import React, { useState } from 'react'
import { Segment, Header, Icon, List, Divider } from 'semantic-ui-react'
import NewUser from './NewUser'

function NewUsers({ newUsers, user, userFollowStats }) {
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats)

  return (
    <Segment raised style={{ height: '80vh', overflow: 'auto' }}>
      <Header style={{ color: 'teal' }}>
        <Icon name="users" />
        <Header.Content>
          New to NumStagram
          <Header.Subheader>Say hello!</Header.Subheader>
        </Header.Content>
      </Header>
      <Divider style={{ marginBottom: '0' }} />
      {newUsers?.length ? (
        <List size="large" selection verticalAlign="middle">
          {newUsers
            .filter((u) => u._id !== user?._id)
            .map((u) => (
              <NewUser
                key={u._id}
                user={u}
                loggedUser={user}
                setUserFollowStats={setUserFollowStats}
                loggedUserFollowStats={loggedUserFollowStats}
              />
            ))}
        </List>
      ) : (
        <p style={{ textAlign: 'center', color: 'gray' }}>
          <big>
            <i>No new users</i>
          </big>
        </p>
      )}
    </Segment>
  )
}

export default NewUsers
