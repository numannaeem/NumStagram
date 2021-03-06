import React, { useEffect, useState } from 'react'
import { Form, Button, Message, Segment } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import catchErrors from '../../utils/catchErrors'
import axios from 'axios'

function ResetPage() {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState(null)

  const [emailEntered, setEmailEntered] = useState(false)

  const [loading, setLoading] = useState(false)

  const resetPassword = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {
      await axios.post(`${baseUrl}/api/reset`, { email })
      setEmailEntered(true)
    } catch (error) {
      setErrorMsg(catchErrors(error))
    }

    setLoading(false)
  }

  useEffect(() => {
    errorMsg && setTimeout(() => setErrorMsg(null), 5000)
  }, [errorMsg])

  return (
    <>
      {emailEntered ? (
        <Message
          attached
          icon="mail"
          header="Check your inbox"
          content="Please check your inbox for further instructions"
          success
        />
      ) : (
        <>
          <Message
            attached
            size="small"
            icon="settings"
            header="Reset Password"
            color="purple"
            content="Enter your email below and we'll send you a link to reset your password"
          />
          <Form loading={loading} onSubmit={resetPassword} error={errorMsg !== null}>
            <Message error header="Oops!" content={errorMsg} />

            <Segment>
              <Form.Input
                fluid
                icon="mail outline"
                type="email"
                iconPosition="left"
                label="Email"
                placeholder="Enter email address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <Button
                disabled={loading || email.length === 0}
                type="submit"
                color="purple"
                content="Submit"
              />
            </Segment>
          </Form>
        </>
      )}
    </>
  )
}

export default ResetPage
