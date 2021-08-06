import React, { useState } from 'react'
import { List, Popup, Image } from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import catchErrors from '../../utils/catchErrors'
import cookie from 'js-cookie'
import Router from 'next/router'
import { LikesPlaceHolder } from '../Layout/PlaceHolderGroup'

function LikesList({ postId, trigger, commentId }) {
  const [likesList, setLikesList] = useState([])
  const [loading, setLoading] = useState(false)

  const getLikesList = async () => {
    setLoading(true)
    try {
      const res = commentId
        ? await axios.get(`${baseUrl}/api/posts/like/${postId}/${commentId}`, {
            headers: { Authorization: cookie.get('token') }
          })
        : await axios.get(`${baseUrl}/api/posts/like/${postId}`, {
            headers: { Authorization: cookie.get('token') }
          })
      setLikesList(res.data)
    } catch (error) {
      alert(catchErrors(error))
    }
    setLoading(false)
  }

  return (
    <Popup
      on="click"
      onClose={() => setLikesList([])}
      onOpen={getLikesList}
      popperDependencies={[likesList]}
      trigger={trigger}
      wide
    >
      {loading ? (
        <LikesPlaceHolder />
      ) : (
        <>
          {likesList.length > 0 && (
            <div
              style={{
                overflow: 'auto',
                maxHeight: '15rem',
                height: '15rem'
              }}
            >
              <List selection verticalAlign="middle">
                {likesList.map((like) => (
                  <List.Item key={like._id}>
                    <Image avatar src={like.user.profilePicUrl} />

                    <List.Content
                      onClick={() => Router.push(`/${like.user.username}`)}
                      as="a"
                      content={like.user.name}
                    />
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  )
}

export default LikesList
