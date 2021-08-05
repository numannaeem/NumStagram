import React from 'react'
import { Menu, Container } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

function Navbar() {
  const router = useRouter()

  const isActive = (route) => router.pathname === route

  return (
    <Menu fluid color="teal" inverted borderless>
      <Container fluid text>
        <Menu.Item id="logo" content="NumStagram" position="left" />
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
