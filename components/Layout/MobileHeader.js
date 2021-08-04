import React from 'react'
import { Menu, Container, Icon, Dropdown } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { logoutUser } from '../../utils/authUser'

function MobileHeader({ user: { unreadNotification, email, unreadMessage, username } }) {
  const router = useRouter()
  const isActive = (route) => router.pathname === route

  return (
    <>
      <Menu
        style={{
          display: 'flex',
          position: 'sticky',
          top: '0',
          zIndex: '1030',
          boxShadow: '0 1px 10px 1px gray'
        }}
        fluid
        borderless
      >
        <Container text style={{ justifyContent: 'space-around' }}>
          <Link href="/">
            <Menu.Item header active={isActive('/')}>
              <Icon name="rss" size="large" />
            </Menu.Item>
          </Link>

          <Link href="/messages">
            <Menu.Item header active={isActive('/messages')}>
              <Icon
                name="comments outline"
                size="large"
                {...(unreadMessage && { color: 'orange' })}
              />
            </Menu.Item>
          </Link>

          <Link href="/notifications">
            <Menu.Item header active={isActive('/notifications')}>
              <Icon
                name="bell outline"
                size="large"
                {...(unreadNotification && { color: 'orange' })}
              />
            </Menu.Item>
          </Link>

          <Link shallow={true} href="/search">
            <Menu.Item header active={isActive('/search')}>
              <Icon name="search" size="large" />
            </Menu.Item>
          </Link>

          <Dropdown item icon="bars" direction="left">
            <Dropdown.Menu>
              <Link href={`/${username}`}>
                <Dropdown.Item active={isActive(`/${username}`)}>
                  <Icon name="user" size="large" />
                  Account
                </Dropdown.Item>
              </Link>

              <Dropdown.Item onClick={() => logoutUser(email)}>
                <Icon name="sign out alternate" size="large" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Menu>
    </>
  )
}

export default MobileHeader
