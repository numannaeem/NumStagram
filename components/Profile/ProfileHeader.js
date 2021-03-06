import React, { useState } from 'react'
import { Segment, Image, Grid, Header, Button, List } from 'semantic-ui-react'
import { followUser, unfollowUser, sendRequest } from '../../utils/profileActions'

function ProfileHeader({
  profile,
  ownAccount,
  loggedUserFollowStats,
  setUserFollowStats,
  setPrivateAcc,
  privateAcc,
  followRequestSent,
  setFollowRequestSent
}) {
  const [loading, setLoading] = useState(false)

  const isFollowing =
    loggedUserFollowStats.following.length > 0 &&
    loggedUserFollowStats.following.filter(
      (following) => following.user === profile.user._id
    ).length > 0

  return (
    <>
      <Segment raised color="teal" style={{ backgroundColor: '#ffffef' }}>
        <Grid>
          <Grid.Row divided>
            <Grid.Column mobile={4} largeScreen={3} widescreen={3}>
              <Image size="tiny" circular src={profile.user.profilePicUrl} />
            </Grid.Column>
            <Grid.Column
              verticalAlign="middle"
              mobile={12}
              largeScreen={13}
              widescreen={13}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              <Header
                as="h2"
                content={profile.user.name}
                style={{ marginBottom: '5px' }}
              />
              {profile.bio}
            </Grid.Column>
          </Grid.Row>
          {!ownAccount && (
            <Grid.Row columns={1}>
              <Grid.Column>
                <Button
                  size="small"
                  compact
                  loading={loading}
                  disabled={loading || (privateAcc && followRequestSent)}
                  content={
                    isFollowing
                      ? 'Following'
                      : !privateAcc
                      ? 'Follow'
                      : followRequestSent
                      ? 'Follow request sent'
                      : 'Send follow request'
                  }
                  icon={
                    isFollowing
                      ? 'check circle'
                      : privateAcc && followRequestSent
                      ? 'clock outline'
                      : 'add user'
                  }
                  color={isFollowing ? 'instagram' : 'twitter'}
                  onClick={async () => {
                    setLoading(true)
                    isFollowing && profile.user.private && setPrivateAcc(true)
                    isFollowing
                      ? await unfollowUser(profile.user._id, setUserFollowStats)
                      : privateAcc
                      ? await sendRequest(profile.user._id, setFollowRequestSent)
                      : await followUser(profile.user._id, setUserFollowStats)
                    setLoading(false)
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          )}
          <Grid.Row>
            <Grid.Column>
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
            </Grid.Column>
          </Grid.Row>

          {/* <Grid.Column width={5} style={{ textAlign: 'center' }}>
            <Grid.Row verticalAlign="middle">
              <Image size="medium" avatar src={profile.user.profilePicUrl} />
            </Grid.Row>
            <br />

            {!ownAccount && (
              <Button
                compact
                loading={loading}
                disabled={loading || (privateAcc && followRequestSent)}
                content={
                  isFollowing
                    ? 'Following'
                    : !privateAcc
                    ? 'Follow'
                    : followRequestSent
                    ? 'Follow request sent'
                    : 'Send follow request'
                }
                icon={
                  isFollowing
                    ? 'check circle'
                    : privateAcc && followRequestSent
                    ? 'clock outline'
                    : 'add user'
                }
                color={isFollowing ? 'instagram' : 'twitter'}
                onClick={async () => {
                  setLoading(true)
                  isFollowing && profile.user.private && setPrivateAcc(true)
                  isFollowing
                    ? await unfollowUser(profile.user._id, setUserFollowStats)
                    : privateAcc
                    ? await sendRequest(profile.user._id, setFollowRequestSent)
                    : await followUser(profile.user._id, setUserFollowStats)
                  setLoading(false)
                }}
              />
            )}
          </Grid.Column> */}
        </Grid>
      </Segment>
    </>
  )
}

export default ProfileHeader
