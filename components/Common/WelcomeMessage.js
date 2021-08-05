import { Icon, Message, Divider } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export const HeaderMessage = () => {
  const router = useRouter()
  const signupRoute = router.pathname === '/signup'

  return (
    <Message
      color="purple"
      size="small"
      header={signupRoute ? 'Get started' : 'Welcome back'}
      icon={signupRoute ? 'edit' : 'privacy'}
      content={signupRoute ? 'Create a new account' : 'Login with email and password'}
    />
  )
}

export const FooterMessage = () => {
  const router = useRouter()
  const signupRoute = router.pathname === '/signup'

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Existing user? <Link href="/login">Login here instead</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            New user? <Link href="/signup">Sign up here instead</Link>
          </Message>
        </>
      )}
    </>
  )
}
