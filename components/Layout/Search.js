import React, { useEffect, useRef, useState } from 'react'
import { List, Image, Search, Divider } from 'semantic-ui-react'
import axios from 'axios'
import cookie from 'js-cookie'
import Router from 'next/router'
import baseUrl from '../../utils/baseUrl'
import NewUsers from '../Common/NewUsers'
let cancel

function SearchComponent({ user, autofocus, size, newUsers, userFollowStats }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])
  let searchRef = useRef()

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

        if (res.data.length === 0) {
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
        console.log('Error Searching')
      }

      setLoading(false)
    }
  }

  useEffect(() => {
    autofocus && searchRef.current?.focus()
  }, [])

  return (
    <>
      <Search
        input={{ ref: searchRef }}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          border: '2px solid teal',
          borderRadius: '22px'
        }}
        onBlur={() => {
          results.length > 0 && setResults([])
          loading && setLoading(false)
          setText('')
        }}
        size={size || 'large'}
        fluid
        placeholder="Search away!"
        loading={loading}
        value={text}
        resultRenderer={ResultRenderer}
        results={results}
        onSearchChange={handleChange}
        minCharacters={2}
        onResultSelect={(e, data) => Router.push(`/${data.result.username}`)}
      />
      <Divider hidden />
      {newUsers?.length > 0 && (
        <NewUsers user={user} newUsers={newUsers} userFollowStats={userFollowStats} />
      )}
    </>
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

export default SearchComponent
