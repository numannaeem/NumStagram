import React from 'react'
import Search from '../components/Layout/Search'

function SearchPage({ newUsers }) {
  return (
    <div style={{ padding: '14px', minHeight: '100vh' }}>
      <Search autofocus size="big" newUsers={newUsers} />
    </div>
  )
}

export default SearchPage
