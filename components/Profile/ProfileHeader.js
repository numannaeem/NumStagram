import React, { useState } from 'react'
import { Segment, Image, Grid, Divider, Header, Button, List } from 'semantic-ui-react'
import { followUser, unfollowUser } from '../../utils/profileActions'

function ProfileHeader({
  profile,
  ownAccount,
  loggedUserFollowStats,
  setUserFollowStats
}) {
  const [loading, setLoading] = useState(false)

  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === profile.user._id
    ).length > 0

  return (
    <>
      <Segment style={{ backgroundColor: '#fbffdb' }}>
        <Grid stackable>
          <Grid.Column width={11}>
            <Grid.Row>
              <Header
                as="h2"
                content={profile.user.name}
                style={{ marginBottom: '5px' }}
              />
            </Grid.Row>

            <Grid.Row style={{ whiteSpace: 'pre-wrap' }} stretched>
              {profile.bio}
              <Divider hidden />
            </Grid.Row>

            <Grid.Row>
              <List>
                <List.Item>
                  <List.Icon name="mail" />
                  <List.Content
                    as="a"
                    href={'mailto:' + profile.user.email}
                    content={profile.user.email}
                  />
                </List.Item>
                {profile.social ? (
                  <>
                    {profile.social.facebook && (
                      <List.Item>
                        <List.Icon name="facebook" color="blue" />
                        <List.Content
                          as="a"
                          href={'https://' + profile.social.facebook}
                          target="_blank"
                          style={{ color: 'blue' }}
                          content={profile.social.facebook}
                        />
                      </List.Item>
                    )}

                    {profile.social.instagram && (
                      <List.Item>
                        <List.Icon name="instagram" color="red" />
                        <List.Content
                          as="a"
                          href={'https://' + profile.social.instagram}
                          target="_blank"
                          style={{ color: 'blue' }}
                          content={profile.social.instagram}
                        />
                      </List.Item>
                    )}

                    {profile.social.youtube && (
                      <List.Item>
                        <List.Icon name="youtube" color="red" />
                        <List.Content
                          as="a"
                          href={'https://' + profile.social.youtube}
                          target="_blank"
                          style={{ color: 'blue' }}
                          content={profile.social.youtube}
                        />
                      </List.Item>
                    )}

                    {profile.social.twitter && (
                      <List.Item>
                        <List.Icon name="twitter" color="blue" />
                        <List.Content
                          as="a"
                          href={'https://' + profile.social.twitter}
                          target="_blank"
                          style={{ color: 'blue' }}
                          content={profile.social.twitter}
                        />
                      </List.Item>
                    )}
                  </>
                ) : null}
              </List>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column width={5} style={{ textAlign: 'center' }}>
            <Grid.Row verticalAlign="middle">
              <Image size="medium" avatar src={profile.user.profilePicUrl} />
            </Grid.Row>
            <br />

            {!ownAccount && (
              <Button
                compact
                loading={loading}
                disabled={loading}
                content={isFollowing ? 'Following' : 'Follow'}
                icon={isFollowing ? 'check circle' : 'add user'}
                color={isFollowing ? 'instagram' : 'twitter'}
                onClick={async () => {
                  setLoading(true)
                  isFollowing
                    ? await unfollowUser(profile.user._id, setUserFollowStats)
                    : await followUser(profile.user._id, setUserFollowStats)
                  setLoading(false)
                }}
              />
            )}
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  )
}

export default ProfileHeader
