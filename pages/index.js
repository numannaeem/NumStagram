import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import CreatePost from '../components/Post/CreatePost'
import CardPost from '../components/Post/CardPost'
import { Grid, Segment } from 'semantic-ui-react'
import { parseCookies } from 'nookies'
import { NoPosts } from '../components/Layout/NoData'
import { ErrorToastr, PostDeleteToastr } from '../components/Layout/Toastr'
import InfiniteScroll from 'react-infinite-scroll-component'
import { PlaceHolderPosts, EndMessage } from '../components/Layout/PlaceHolderGroup'
import cookie from 'js-cookie'
import getUserInfo from '../utils/getUserInfo'
import MessageNotificationModal from '../components/Home/MessageNotificationModal'
import newMsgSound from '../utils/newMsgSound'

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || [])
  const [error, setError] = useState(null)
  const [showToastr, setShowToastr] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const [pageNumber, setPageNumber] = useState(2)

  const socket = useRef()

  const [newMessageReceived, setNewMessageReceived] = useState(null)
  const [newMessageModal, showNewMessageModal] = useState(false)

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl)
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id })

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender)

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl
          })
          showNewMessageModal(true)
        }
        newMsgSound(name)
      })
    }

    document.title = `Welcome, ${user.name.split(' ')[0]}`

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect')
        socket.current.off()
      }
    }
  }, [])

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000)
  }, [showToastr])

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get('token') },
        params: { pageNumber }
      })

      if (res.data.length === 0) setHasMore(false)

      setPosts((prev) => [...prev, ...res.data])
      setPageNumber((prev) => prev + 1)
    } catch (error) {
      setError('Error fetching posts')
    }
  }

  if (posts.length === 0 || errorLoading)
    return (
      <Segment style={{ minHeight: '100vh' }}>
        {newMessageModal && newMessageReceived !== null && (
          <MessageNotificationModal
            socket={socket}
            showNewMessageModal={showNewMessageModal}
            newMessageModal={newMessageModal}
            newMessageReceived={newMessageReceived}
            user={user}
          />
        )}
        <CreatePost user={user} setPosts={setPosts} />
        <NoPosts />
      </Segment>
    )

  return (
    <>
      {error && <ErrorToastr error={error} />}
      {showToastr && <PostDeleteToastr />}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      <Segment style={{ borderTop: 'none' }}>
        <CreatePost user={user} setPosts={setPosts} />
        <h2 style={{ color: 'teal', marginBottom: '0.2rem' }}>Your feed</h2>
        <InfiniteScroll
          hasMore={hasMore}
          next={fetchDataOnScroll}
          loader={<PlaceHolderPosts />}
          endMessage={<EndMessage />}
          dataLength={posts.length}
        >
          <Segment
            basic
            style={{
              paddingLeft: '0.1rem',
              paddingRight: '0.1rem',
              border: 'none'
            }}
          >
            {posts.map((post) => (
              <CardPost
                key={post._id}
                post={post}
                user={user}
                setPosts={setPosts}
                setShowToastr={setShowToastr}
              />
            ))}
          </Segment>
        </InfiniteScroll>
      </Segment>
    </>
  )
}

Index.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx)

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 }
    })

    return { postsData: res.data }
  } catch (error) {
    return { errorLoading: true }
  }
}

export default Index
