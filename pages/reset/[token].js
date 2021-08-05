import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Form, Button, Message, Segment } from 'semantic-ui-react'
import baseUrl from '../../utils/baseUrl'
import catchErrors from '../../utils/catchErrors'
import axios from 'axios'

function TokenPage() {
  const router = useRouter()

  const [newPassword, setNewPassword] = useState({ field1: '', field2: '' })

  const { field1, field2 } = newPassword

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setNewPassword((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    errorMsg !== null && setTimeout(() => setErrorMsg(null), 5000)
  }, [errorMsg])

  const resetPassword = async (e) => {
    e.preventDefault()

    setLoading(true)
    try {
      if (field1 !== field2) {
        return setErrorMsg('Passwords do not match')
      }

      await axios.post(`${baseUrl}/api/reset/token`, {
        password: field1,
        token: router.query.token
      })

      setSuccess(true)
    } catch (error) {
      setErrorMsg(catchErrors(error))
    }

    setLoading(false)
  }

  return (
    <>
      {success ? (
        <Message
          attached
          success
          size="large"
          header="Password reset successfully"
          icon="check"
          content="Login Again"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/login')}
        />
      ) : (
        <Message
          attached
          icon="settings"
          header="Reset password"
          content="(can't wait for you to forget this one too 🙄)"
          size="small"
          color="purple"
        />
      )}

      {!success && (
        <Form loading={loading} onSubmit={resetPassword} error={errorMsg !== null}>
          <Message error header="Oops!" content={errorMsg} />

          <Segment>
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="New password"
              placeholder="Enter new Password"
              name="field1"
              onChange={handleChange}
              value={field1}
              required
            />
            <Form.Input
              fluid
              icon="eye"
              type="password"
              iconPosition="left"
              label="Confirm password"
              placeholder="Confirm new Password"
              name="field2"
              onChange={handleChange}
              value={field2}
              required
            />

            <Button
              disabled={field1 === '' || field2 === '' || loading}
              type="submit"
              color="purple"
              content="Reset password"
            />
          </Segment>
        </Form>
      )}
    </>
  )
}

export default TokenPage
