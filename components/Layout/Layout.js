import React, { createRef } from 'react'
import HeadTags from './HeadTags'
import Navbar from './Navbar'
import { Container, Visibility, Grid, Sticky, Ref, Segment } from 'semantic-ui-react'
import nprogress from 'nprogress'
import Router, { useRouter } from 'next/router'
import SideMenu from './SideMenu'
import Search from './Search'
import MobileHeader from './MobileHeader'
import Footer from './Footer'
import { createMedia } from '@artsy/fresnel'

const appMedia = createMedia({
  breakpoints: {
    zero: 0,
    mobile: 549,
    tablet: 768,
    computer: 1080
  }
})

const mediaStyles = appMedia.createMediaStyle()
const { Media, MediaContextProvider } = appMedia

function Layout({ children, user, newUsers, userFollowStats }) {
  const contextRef = createRef()
  const router = useRouter()

  const messagesRoute = router.pathname === '/messages'

  Router.onRouteChangeStart = () => nprogress.start()
  Router.onRouteChangeComplete = () => nprogress.done()
  Router.onRouteChangeError = () => nprogress.done()

  return (
    <>
      <HeadTags />
      {user ? (
        <MediaContextProvider>
          {!messagesRoute ? (
            <>
              <style>{mediaStyles}</style>
              <div style={{ marginLeft: '1rem' }}>
                <Media greaterThanOrEqual="computer">
                  <Ref innerRef={contextRef}>
                    <Grid style={{ minHeight: '105vh' }}>
                      <Grid.Column style={{ paddingRight: '0' }} width={3}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} pc />
                        </Sticky>
                      </Grid.Column>
                      <Grid.Column style={{ zIndex: '999', paddingRight: '0' }} width={8}>
                        <Visibility context={contextRef}>{children}</Visibility>
                      </Grid.Column>
                      <Grid.Column
                        style={{
                          backgroundImage: 'linear-gradient(#d6fff0, white)',
                          paddingLeft: '0'
                        }}
                        width={5}
                      >
                        <Sticky context={contextRef}>
                          <Segment basic>
                            <Search
                              user={user}
                              newUsers={newUsers}
                              userFollowStats={userFollowStats}
                            />
                          </Segment>
                        </Sticky>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={['tablet', 'computer']}>
                  <Ref innerRef={contextRef}>
                    <Grid>
                      <Grid.Column style={{ paddingRight: '0' }}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} tablet />
                        </Sticky>
                      </Grid.Column>
                      <Grid.Column style={{ zIndex: '999' }} width={15}>
                        <Visibility context={contextRef}>{children}</Visibility>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={['mobile', 'tablet']}>
                  <Ref innerRef={contextRef}>
                    <Grid>
                      <Grid.Column style={{ paddingRight: '0' }} width={2}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} tablet />
                        </Sticky>
                      </Grid.Column>
                      <Grid.Column style={{ zIndex: '999' }} width={14}>
                        <Visibility context={contextRef}>{children}</Visibility>
                      </Grid.Column>
                    </Grid>
                  </Ref>
                </Media>

                <Media between={['zero', 'mobile']}>
                  <Grid style={{ minHeight: '100vh' }}>
                    <Grid.Column style={{ padding: '0', paddingTop: '1rem' }}>
                      <MobileHeader user={user} />
                      {children}
                      <Footer />
                    </Grid.Column>
                  </Grid>
                </Media>
              </div>
              <Media greaterThanOrEqual={'mobile'}>
                <Footer />
              </Media>
            </>
          ) : (
            <>
              <style>{mediaStyles}</style>

              <Media between={['zero', 'tablet']}>
                <div>{React.cloneElement(children, { isMobile: true })}</div>
              </Media>
              <Media greaterThanOrEqual={'tablet'}>
                <Grid>
                  <Grid.Column style={{ paddingRight: '0' }} width={16}>
                    {children}
                  </Grid.Column>
                </Grid>
              </Media>
            </>
          )}
        </MediaContextProvider>
      ) : (
        <>
          <Navbar />
          <Container text style={{ paddingTop: '1rem' }}>
            {children}
          </Container>
        </>
      )}
    </>
  )
}

export default Layout
