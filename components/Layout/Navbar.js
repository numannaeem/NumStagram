import React from 'react'
import { Menu, Container, Icon, Image } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Navbar() {
  const router = useRouter()

  const isActive = (route) => router.pathname === route

  return (
    <Menu fluid borderless>
      <Container fluid text>
        <Menu.Item id="logo" header position="left">
          NumStagram
        </Menu.Item>
        <Link href="/login">
          <Menu.Item link position="right" active={isActive('/login')}>
            Login
          </Menu.Item>
        </Link>

        <Link href="/signup">
          <Menu.Item link active={isActive('/signup')}>
            Signup
          </Menu.Item>
        </Link>
      </Container>
    </Menu>
  )
}

export default Navbar
