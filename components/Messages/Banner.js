import React from 'react'
import { Segment, Grid, Image, Icon } from 'semantic-ui-react'

function Banner({ bannerData }) {
  const { name, profilePicUrl, online } = bannerData

  return (
    <Segment color="teal" attached="top">
      <Grid>
        <Grid.Column floated="left" width={14}>
          <h4>
            <Image avatar src={profilePicUrl} />
            {name} {online && <Icon name="circle" size="small" color="green" />}
          </h4>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default Banner
