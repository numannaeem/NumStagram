import React from 'react'
import { Segment, Grid, Image, Icon } from 'semantic-ui-react'
import Link from 'next/link'

function Banner({ bannerData }) {
  const { username, name, profilePicUrl, online } = bannerData

  return (
    <Segment color="teal" attached="top">
      <Grid>
        <Grid.Column floated="left" width={14}>
          <Image avatar src={profilePicUrl} />
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
