import React from 'react'
import { Segment, Header, Icon, List, Image, Divider, Button } from 'semantic-ui-react'
import { calculateDays } from '../../utils/calculateTime'
import { useRouter } from 'next/router'

function NewUsers({ newUsers }) {
  const router = useRouter()
  return (
    <Segment raised style={{ height: '80vh', overflow: 'auto' }}>
      <Header icon textAlign="center" style={{ color: 'teal' }}>
        <Icon name="users" />
        <Header.Content>
          New to NumStagram
          <Header.Subheader as="h6">
            Users who have joined within the last week
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Divider />
      {newUsers?.length ? (
        <List size="large" selection verticalAlign="middle">
          {newUsers.map((u) => (
            <>
              <List.Item
                key={u._id}
                title="View Profile"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  router.push(`/${u.username}`, undefined, { shallow: true })
                }}
              >
                <Image src={u.profilePicUrl} avatar />
                <List.Content>
                  <List.Header as="a" content={u.name} />
                  <List.Description>Joined {calculateDays(u.createdAt)}</List.Description>
                </List.Content>
                {/* <List.Content style={{ marginTop: '0.5rem' }}>
                  <Button
                    icon="add user"
                    color="blue"
                    compact
                    size="small"
                    content="Follow"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    icon="comment outline"
                    color="teal"
                    compact
                    size="small"
                    content="Message"
                  />
                </List.Content> */}
              </List.Item>
            </>
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
