import React, { useState } from 'react'
import { List, Image, Search } from 'semantic-ui-react'
import axios from 'axios'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'
import baseUrl from '../../utils/baseUrl'
let cancel

function ChatListSearch({ user, chats, setChats }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  const router = useRouter()

  const addChat = (result) => {
    const alreadyInChat =
      chats.length > 0 &&
      chats.filter((chat) => chat.messagesWith === result._id).length > 0

    if (alreadyInChat) {
      return router.push(`/messages?message=${result._id}`)
    }
    //
    else {
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: '',
        date: Date.now()
      }

      setChats((prev) => [newChat, ...prev])

      return router.push(`/messages?message=${result._id}`)
    }
  }

  const handleChange = async (e) => {
    const { value } = e.target
    setText(value)

    if (value?.trim().length === 0) return setResults([])

    if (value && value.length) {
      setLoading(true)

      try {
        cancel && cancel()
        const CancelToken = axios.CancelToken
        const token = cookie.get('token')

        const res = await axios.get(`${baseUrl}/api/search/${value}`, {
          headers: { Authorization: token },
          cancelToken: new CancelToken((canceler) => {
            cancel = canceler
          })
        })
        const filteredResults = res.data.filter(
          (r) => r._id.toString() !== user._id.toString()
        )

        if (filteredResults.length === 0) {
          setLoading(false)
          return setResults([])
        }

        setResults(
          res.data.map((r) => ({
            _id: r._id,
            name: r.name,
            profilePicUrl: r.profilePicUrl,
            username: r.username
          }))
        )
      } catch (error) {
        console.log(error)
        console.log('Error Searching')
      }

      setLoading(false)
    }
  }

  return (
    <Search
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
      onBlur={() => {
        results.length > 0 && setResults([])
        loading && setLoading(false)
        setText('')
      }}
      loading={loading}
      value={text}
      fluid
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect={(e, data) => addChat(data.result)}
    />
  )
}

const ResultRenderer = ({ _id, profilePicUrl, name }) => {
  return (
    <List.Item key={_id}>
      <Image src={profilePicUrl} alt="ProfilePic" className="results-image" />
      <List.Content header={name} />
    </List.Item>
  )
}

export default ChatListSearch
