import React from 'react'
import Search from '../components/Layout/Search'

function SearchPage({ newUsers, user, userFollowStats }) {
  return (
    <div style={{ padding: '14px', minHeight: '100vh' }}>
      <Search
        autofocus
        size="big"
        user={user}
        newUsers={newUsers}
        userFollowStats={userFollowStats}
      />
    </div>
  )
}

export default SearchPage
