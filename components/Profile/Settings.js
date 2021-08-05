import React, { useState, useEffect } from 'react'
import {
  List,
  Divider,
  Message,
  Checkbox,
  Form,
  Button,
  Transition,
  Container
} from 'semantic-ui-react'
import catchErrors from '../../utils/catchErrors'
import {
  deleteAccount,
  passwordUpdate,
  toggleMessagePopup,
  toggleMessageSound,
  toggleVisibility
} from '../../utils/profileActions'
import { ToastContainer, toast } from 'react-toastify'

function Settings({ visibility, newMessagePopup, newMessageSound }) {
  const [passwordFields, showPasswordFields] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const [popupSetting, setPopupSetting] = useState(newMessagePopup)
  const [visibilitySetting, setVisibilitySetting] = useState(visibility)
  const [soundSetting, setSoundSetting] = useState(newMessageSound)

  return (
    <>
      <List size="big">
        <List.Item>
          <List.Content>
            <List.Header style={{ color: 'black' }} content="Show 'New Message' pop-up" />
          </List.Content>

          <div style={{ marginTop: '10px', color: 'gray', fontSize: '80%' }}>
            Control whether a pop-up should appear when you recieve a new message.
            <br />
            <br />
            <Checkbox
              checked={popupSetting}
              slider
              onChange={() => {
                try {
                  toggleMessagePopup(popupSetting, setPopupSetting, toast)
                } catch (error) {
                  toast.error(catchErrors(error))
                }
              }}
            />
          </div>
        </List.Item>
        <Divider />

        <List.Item>
          <List.Content>
            <List.Header style={{ color: 'black' }} content="Play a bell sound" />
          </List.Content>

          <div style={{ marginTop: '10px', color: 'gray', fontSize: '80%' }}>
            Control whether a bell sound should be played when you recieve a new message.
            <br />
            <br />
            <Checkbox
              checked={soundSetting}
              slider
              onChange={() => {
                try {
                  toggleMessageSound(setSoundSetting, toast)
                } catch (error) {
                  toast.error(catchErrors(error))
                }
              }}
            />
          </div>
        </List.Item>

        <Divider />

        <List.Item>
          <List.Content>
            <List.Header style={{ color: 'black' }} content="Account visibility mode" />
          </List.Content>

          <div style={{ marginTop: '10px', color: 'gray', fontSize: '80%' }}>
            Accounts are private by default, but that can be toggled here.
            <br />
            <br />
            <Checkbox
              style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
              label={visibilitySetting ? 'Private' : 'Public'}
              checked={visibilitySetting}
              slider
              onChange={() => {
                try {
                  toggleVisibility(setVisibilitySetting, toast)
                } catch (error) {
                  toast.error('Something went wrong 😵')
                }
              }}
            />
          </div>
        </List.Item>

        <Divider />
        <List.Item>
          <List.Icon name="unlock alternate" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              onClick={() => {
                showPasswordFields(!passwordFields)
              }}
              as="a"
              content="Update Password"
            />
          </List.Content>

          <Transition.Group animation="fade down" duration={400}>
            {passwordFields && (
              <Container style={{ padding: '0', marginTop: '0.5rem' }} fluid>
                <UpdatePassword
                  setSuccess={toast}
                  showPasswordFields={showPasswordFields}
                />
              </Container>
            )}
          </Transition.Group>
        </List.Item>
        <Divider />
        <List.Item>
          <List.Icon color="red" name="trash" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => {
                setShowDeleteButton((prev) => !prev)
              }}
              content="Delete Account"
            />
          </List.Content>

          <Transition.Group animation="fade down" duration={500}>
            {showDeleteButton && (
              <Container fluid>
                <DeleteAccount setShowDeleteButton={setShowDeleteButton} />
              </Container>
            )}
          </Transition.Group>
        </List.Item>
      </List>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
    </>
  )
}

const DeleteAccount = ({ setShowDeleteButton }) => {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  return (
    <List.List>
      <List.Item>
        <div style={{ marginTop: '10px' }}>
          <p style={{ marginBottom: '0.3rem' }}>
            Are you sure?&nbsp;&nbsp;
            <small style={{ color: 'red' }}>
              <b>This action is irreversible!</b>
            </small>
          </p>
          <Form
            onSubmit={async () => {
              try {
                setLoading(true)
                await deleteAccount(password)
              } catch (error) {
                window.alert('Something went wrong. Please try again later.')
              }
              setLoading(false)
            }}
          >
            <Form.Input
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () => setShow((prev) => !prev)
              }}
              type={show ? 'text' : 'password'}
              iconPosition="left"
              placeholder="Enter password to confirm"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              disabled={loading}
              compact
              icon="exclamation circle"
              color="red"
              content="Yes, I'm sure"
              type="submit"
            />

            <Button
              disabled={loading}
              type="button"
              compact
              content="Cancel"
              onClick={() => setShowDeleteButton(false)}
            />
          </Form>
          {loading && (
            <>
              <p style={{ marginTop: '10px' }}>Deleting your account...</p>
              <p style={{ color: 'gray' }}>
                We're sad to see you go 🙁 <br />
                <b>Come back soon!</b>
              </p>
            </>
          )}
        </div>
      </List.Item>
    </List.List>
  )
}

const UpdatePassword = ({ toast, showPasswordFields }) => {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setError] = useState(null)

  const [userPasswords, setUserPasswords] = useState({
    currentPassword: '',
    newPassword: ''
  })
  const [typed, showTyped] = useState({
    field1: false,
    field2: false
  })

  const { field1, field2 } = typed

  const { currentPassword, newPassword } = userPasswords

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserPasswords((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    errorMsg && setTimeout(() => setError(null), 5000)
  }, [errorMsg])

  return (
    <>
      <Form
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          try {
            await passwordUpdate(toast, userPasswords)
            showPasswordFields(false)
          } catch (error) {
            setError(catchErrors(error))
          }
          setLoading(false)
        }}
      >
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () => showTyped((prev) => ({ ...prev, field1: !field1 }))
              }}
              type={field1 ? 'text' : 'password'}
              iconPosition="left"
              label="Current Password"
              placeholder="Enter current Password"
              name="currentPassword"
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () => showTyped((prev) => ({ ...prev, field2: !field2 }))
              }}
              type={field2 ? 'text' : 'password'}
              iconPosition="left"
              label="New Password"
              placeholder="Enter New Password"
              name="newPassword"
              onChange={handleChange}
              value={newPassword}
            />

            {/* BUTTONS */}

            <Button
              disabled={loading || currentPassword === '' || newPassword === ''}
              compact
              icon="check"
              type="submit"
              color="teal"
              content="Confirm"
            />

            <Button
              disabled={loading}
              compact
              type="button"
              content="Cancel"
              onClick={() => showPasswordFields(false)}
            />

            <Message icon="meh" error header="Oops!" content={errorMsg} />
          </List.Item>
        </List.List>
      </Form>
    </>
  )
}

export default Settings
