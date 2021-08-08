import React from 'react'
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon
} from 'semantic-ui-react'
import { range } from 'lodash'
import MessageInputField from '../Messages/MessageInputField'
import Spinner from './Spinner'

export const PlaceHolderPosts = () =>
  range(1, 3).map((item) => (
    <div key={item}>
      <Placeholder fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden />
    </div>
  ))

export const PlaceHolderSuggestions = () => (
  <>
    <List.Item>
      <Card color="red">
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Content>

        <Card.Content extra>
          <Button
            disabled
            circular
            size="small"
            icon="add user"
            content="Follow"
            color="twitter"
          />
        </Card.Content>
      </Card>
    </List.Item>
  </>
)

export const PlaceHolderNotifications = () =>
  range(1, 10).map((item) => (
    <div key={item}>
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
      <Divider hidden />
    </div>
  ))

export const EndMessage = () => (
  <Container textAlign="center">
    <Icon name="check circle outline" size="large" />
    <p>You're all caught up!</p>
  </Container>
)

export const LikesPlaceHolder = () =>
  range(1, 6).map((item) => (
    <Placeholder key={item} style={{ minWidth: '150px' }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ))
export const ChatPlaceHolder = ({ mobile }) =>
  mobile ? (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          position: 'sticky',
          top: '0',
          padding: '1rem',
          borderBottom: '1px gray solid'
        }}
      >
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </div>
      <div
        style={{
          flexGrow: '2',
          padding: '0 2px',
          width: '100%',
          overflow: 'auto',
          overflowX: 'hidden',
          backgroundColor: 'whitesmoke',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Spinner />
      </div>

      <div style={{ position: 'sticky', bottom: '0' }}>
        <MessageInputField dummy />
      </div>
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          position: 'sticky',
          top: '0',
          padding: '1rem',
          border: '1px lightgray solid',
          borderTop: '2px solid #00b5ad'
        }}
      >
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
          </Placeholder.Header>
        </Placeholder>
      </div>
      <div
        style={{
          padding: '0 2px',
          width: '100%',
          overflow: 'auto',
          overflowX: 'hidden',
          maxHeight: '32rem',
          height: '32rem',
          backgroundColor: 'whitesmoke',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Spinner />
      </div>

      <div style={{ position: 'sticky', bottom: '0' }}>
        <MessageInputField dummy />
      </div>
    </div>
  )
