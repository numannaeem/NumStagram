import React from 'react'
import { Segment, Grid, Image, Icon } from 'semantic-ui-react'
import Link from 'next/link'

function Banner({ bannerData, isMobile }) {
  const { username, name, profilePicUrl, online } = bannerData
  return (
    <Segment color="teal" attached="top">
      <Grid>
        <Grid.Column>
          {isMobile && (
            <Link shallow={true} replace href="/messages" style={{ color: 'black' }}>
              <Icon size="big" name="angle left" />
            </Link>
          )}
          <Image href={`/${username}`} avatar src={profilePicUrl} />
          <Link href={`/${username}`}>
            <b style={{ cursor: 'pointer' }}>{name}</b>
          </Link>{' '}
          {online && <Icon name="circle" size="small" color="green" />}
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default Banner
