import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import {
  Segment,
  Header,
  Divider,
  Comment,
  Grid,
  List,
  Icon,
  Transition,
  Container
} from 'semantic-ui-react'
import Chat from '../components/Chats/Chat'
import ChatListSearch from '../components/Chats/ChatListSearch'
import { NoMessages } from '../components/Layout/NoData'
import Banner from '../components/Messages/Banner'
import MessageInputField from '../components/Messages/MessageInputField'
import Message from '../components/Messages/Message'
import getUserInfo from '../utils/getUserInfo'
import newMsgSound from '../utils/newMsgSound'
import cookie from 'js-cookie'
import Link from 'next/link'

const scrollDivToBottom = (divRef) =>
  divRef.current?.scrollIntoView({ behaviour: 'smooth' })

function Messages({ chatsData, user, isMobile }) {
  const [chats, setChats] = useState(chatsData)
  const router = useRouter()

  const socket = useRef()
  const [connectedUsers, setConnectedUsers] = useState([])

  const [messages, setMessages] = useState([])
  const [bannerData, setBannerData] = useState({
    name: '',
    profilePicUrl: '',
    online: false
  })

  const divRef = useRef()

  // This ref is for persisting the state of query string in url throughout re-renders. This ref is the value of query string inside url
  const openChatId = useRef('')

  //CONNECTION useEffect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl)
    }
  }, [])

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit('sendNewMsg', {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg
      })
    }
  }

  // Confirming msg is sent and receving the messages useEffect
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msgSent', ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg])

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            )
            previousChat.lastMessage = newMsg.msg
            previousChat.date = newMsg.date
            prev.sort((a, b) => new Date(b.date) - new Date(a.date))
            return [...prev]
          })
        }
      })

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        let senderName

        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg])

          setChats((prev) => {
            const previousChat = prev.find((chat) => chat.messagesWith === newMsg.sender)
            previousChat.lastMessage = newMsg.msg
            previousChat.date = newMsg.date

            senderName = previousChat.name

            return [...prev]
          })
        }
        //
        else {
          const ifPreviouslyMessaged =
            (await chats.filter((chat) => chat.messagesWith === newMsg.sender).length) > 0
          if (ifPreviouslyMessaged) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              )
              previousChat.lastMessage = newMsg.msg
              previousChat.date = newMsg.date

              senderName = previousChat.name

              return [...prev]
            })
          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender)
            senderName = name

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date
            }
            setChats((prev) => [newChat, ...prev])
          }
        }

        newMsgSound(senderName)
      })
    }
  }, [])

  useEffect(() => {
    if (socket.current) {
      socket.current.emit('join', { userId: user._id })
      socket.current.on('connectedUsers', ({ users }) => {
        setConnectedUsers(users)
        setBannerData((prev) => ({
          ...prev,
          online: Boolean(users.filter((u) => u.userId === openChatId?.current).length)
        }))
      })

      if (!isMobile && chats.length > 0 && !router.query.message) {
        router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
          shallow: true
        })
      }
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect')
        socket.current.off()
      }
    }
  }, [])

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef)
  }, [messages])

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMsg', {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId
      })

      socket.current.on('msgDeleted', () => {
        setMessages((prev) => prev.filter((message) => message._id !== messageId))
      })
    }
  }

  const deleteChat = async (messagesWith) => {
    try {
      await axios.delete(`${baseUrl}/api/chats/${messagesWith}`, {
        headers: { Authorization: cookie.get('token') }
      })

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith.toString() !== messagesWith)
      )
      openChatId.current = null
      router.push('/messages', undefined, { shallow: true })
    } catch (error) {
      alert(error.message || 'Something went wrong')
    }
  }

  // LOAD MESSAGES useEffect
  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: router.query.message
      })

      socket.current.on('messagesLoaded', async ({ chat }) => {
        setMessages(chat.messages)
        setBannerData({
          username: chat.messagesWith.username,
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
          online: Boolean(
            connectedUsers?.filter((u) => u.userId === chat.messagesWith._id).length
          )
        })

        openChatId.current = chat.messagesWith._id
        divRef.current && scrollDivToBottom(divRef)
        return
      })

      socket.current.on('noChatFound', () => {
        window.alert('No such user found!')
      })
    }

    if (socket.current && router.query.message) loadMessages()
  }, [router.query.message])

  return !isMobile ? (
    <>
      <Segment padded basic size="large">
        <Link shallow={true} href="/">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <Icon size="large" name="angle left" />
            <big>
              <b> Go home</b>
            </big>
          </div>
        </Link>
        <Divider hidden />

        {chats?.length ? (
          <>
            <Grid stackable columns={2}>
              <Grid.Column stretched width={6}>
                <Segment
                  style={{ backgroundColor: '#39a09c73', border: '2px solid teal' }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <ChatListSearch user={user} chats={chats} setChats={setChats} />
                  </div>
                  <Comment.Group size="big">
                    <Segment
                      raised
                      style={{
                        overflow: 'auto',
                        maxHeight: '32rem',
                        border: '2px solid teal'
                      }}
                    >
                      <List divided selection>
                        {chats.map((chat, i) => (
                          <Chat
                            key={i}
                            chat={chat}
                            connectedUsers={connectedUsers}
                            deleteChat={deleteChat}
                          />
                        ))}
                      </List>
                    </Segment>
                  </Comment.Group>
                </Segment>
              </Grid.Column>

              <Grid.Column width={10}>
                {router.query.message && (
                  <>
                    <div>
                      <Banner bannerData={bannerData} />
                    </div>
                    <div
                      style={{
                        padding: '0 2px',
                        width: '100%',
                        overflow: 'auto',
                        overflowX: 'hidden',
                        maxHeight: '32rem',
                        height: '32rem',
                        backgroundColor: 'whitesmoke'
                      }}
                    >
                      {messages.length > 0 &&
                        messages.map((message, i) => (
                          <Message
                            divRef={divRef}
                            key={i}
                            bannerProfilePic={bannerData.profilePicUrl}
                            message={message}
                            user={user}
                            deleteMsg={deleteMsg}
                          />
                        ))}
                    </div>

                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
              </Grid.Column>
            </Grid>
          </>
        ) : (
          <>
            <NoMessages />
            <div style={{ marginBottom: '10px', maxWidth: '500px' }}>
              <ChatListSearch user={user} chats={chats} setChats={setChats} />
            </div>
          </>
        )}
      </Segment>
    </>
  ) : (
    <>
      {!router.query.message && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            margin: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: '#39a09c73',
            border: '2px solid teal',
            padding: '1rem',
            overflow: 'hidden'
          }}
        >
          <Link shallow={true} href="/">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5rem 0 1rem',
                cursor: 'pointer'
              }}
            >
              <Icon size="large" name="angle left" />
              <big>
                <b> Go home</b>
              </big>
            </div>
          </Link>
          {chats?.length ? (
            <>
              <ChatListSearch user={user} chats={chats} setChats={setChats} />
              <div
                style={{
                  borderRadius: '1rem',
                  flexGrow: '1',
                  border: '2px solid teal',
                  marginTop: '1rem',
                  backgroundColor: 'white',
                  overflow: 'auto'
                }}
              >
                <Comment.Group>
                  <Segment basic>
                    <List divided selection>
                      {chats.map((chat, i) => (
                        <Chat
                          key={i}
                          chat={chat}
                          connectedUsers={connectedUsers}
                          deleteChat={deleteChat}
                        />
                      ))}
                    </List>
                  </Segment>
                </Comment.Group>
              </div>
            </>
          ) : (
            <>
              <NoMessages />
              <div style={{ marginBottom: '10px', maxWidth: '500px' }}>
                <ChatListSearch user={user} chats={chats} setChats={setChats} />
              </div>
            </>
          )}
        </div>
      )}
      <Transition.Group animation="fade right" duration={400}>
        {Boolean(router.query.message) && (
          <Container id="chat-container">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <div style={{ position: 'sticky', top: '0' }}>
                <Banner isMobile bannerData={bannerData} />
              </div>
              <div
                style={{
                  flexGrow: '2',
                  padding: '0 2px',
                  width: '100%',
                  overflow: 'auto',
                  overflowX: 'hidden',
                  backgroundColor: 'whitesmoke'
                }}
              >
                {messages.length > 0 &&
                  messages.map((message, i) => (
                    <Message
                      divRef={divRef}
                      key={i}
                      bannerProfilePic={bannerData.profilePicUrl}
                      message={message}
                      user={user}
                      deleteMsg={deleteMsg}
                    />
                  ))}
              </div>

              <div style={{ position: 'sticky', bottom: '0' }}>
                <MessageInputField sendMsg={sendMsg} />
              </div>
            </div>
          </Container>
        )}
      </Transition.Group>
    </>
  )
}

Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/chats`, {
      headers: { Authorization: token }
    })
    const chats = res.data
    chats.sort((a, b) => new Date(b.date) - new Date(a.date))

    return { chatsData: res.data }
  } catch (error) {
    return { errorLoading: true }
  }
}

export default Messages
