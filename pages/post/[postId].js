import React, { useState } from 'react'
import axios from 'axios'
import { parseCookies } from 'nookies'
import baseUrl from '../../utils/baseUrl'
import {
  Comment,
  Card,
  Icon,
  Image,
  Transition,
  Button,
  Modal,
  Segment,
  Container
} from 'semantic-ui-react'
import PostComments from '../../components/Post/PostComments'
import CommentInputField from '../../components/Post/CommentInputField'
import calculateTime from '../../utils/calculateTime'
import Link from 'next/link'
import { likePost } from '../../utils/postActions'
import LikesList from '../../components/Post/LikesList'
import { NoPostFound } from '../../components/Layout/NoData'

// function PostPage({ post, errorLoading, user }) {
//   if (errorLoading) {
//     return <NoPostFound />
//   }

//   const [likes, setLikes] = useState(post.likes)

//   const isLiked =
//     likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0

//   const [comments, setComments] = useState(post.comments)

//   return (
//     <div style={{ minHeight: '105vh' }}>
//       <Container>
//         <Segment basic>
//           <Card color="teal" fluid>
//             {post.picUrl && (
//               <Image
//                 src={post.picUrl}
//                 floated="left"
//                 wrapped
//                 ui={false}
//                 alt="PostImage"
//               />
//             )}

//             <Card.Content>
//               <Image floated="left" src={post.user.profilePicUrl} avatar circular />
//               <Card.Header>
//                 <Link href={`/${post.user.username}`}>
//                   <a>{post.user.name}</a>
//                 </Link>
//               </Card.Header>

//               <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

//               {post.location && <Card.Meta content={post.location} />}

//               <Card.Description
//                 style={{
//                   fontSize: '17px',
//                   letterSpacing: '0.1px',
//                   wordSpacing: '0.35px'
//                 }}
//               >
//                 {post.text}
//               </Card.Description>
//             </Card.Content>

//             <Card.Content extra>
//               <Icon
//                 name={isLiked ? 'heart' : 'heart outline'}
//                 color="red"
//                 style={{ cursor: 'pointer' }}
//                 onClick={() =>
//                   likePost(post._id, user._id, setLikes, isLiked ? false : true)
//                 }
//               />

//               <LikesList
//                 postId={post._id}
//                 trigger={
//                   likes.length > 0 && (
//                     <span className="spanLikesList">
//                       {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
//                     </span>
//                   )
//                 }
//               />

//               <CommentGroup>
//                 {comments.length > 0 &&
//                   comments.map((comment) => (
//                     <PostComments
//                       key={comment._id}
//                       comment={comment}
//                       postId={post._id}
//                       user={user}
//                       setComments={setComments}
//                     />
//                   ))}
//               </CommentGroup>
//               <Divider hidden />

//               <CommentInputField
//                 user={user}
//                 postId={post._id}
//                 setComments={setComments}
//               />
//             </Card.Content>
//           </Card>
//         </Segment>
//         <Divider hidden />
//       </Container>
//     </div>
//   )
// }

function PostPage({ post, user, errorLoading }) {
  if (errorLoading) {
    return (
      <Segment>
        <NoPostFound />
      </Segment>
    )
  }
  const [likes, setLikes] = useState(post.likes)
  const [liking, setLiking] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  const isLiked =
    likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0

  const [comments, setComments] = useState(post.comments)

  let timer = 0
  let prevent = false
  let delay = 250
  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments
  })

  return (
    <>
      <Segment basic>
        <Card color="teal" fluid>
          <Card.Content>
            <Image floated="left" src={post.user.profilePicUrl} avatar circular />

            <Card.Header>
              <Link href={`/${post.user.username}`}>{post.user.name}</Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}

            <Card.Description
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '17px',
                letterSpacing: '0.1px',
                wordSpacing: '0.35px'
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>
          {post.picUrl && (
            <div style={{ position: 'relative' }}>
              <Image
                onDoubleClick={async () => {
                  if (!liking) {
                    clearTimeout(timer)
                    prevent = true
                    if (!isLiked) {
                      setShowHeart(true)
                      setTimeout(() => setShowHeart(false), 500)
                    }
                    setLiking(true)
                    await likePost(post._id, user._id, setLikes, isLiked ? false : true)
                    setLiking(false)
                  }
                }}
                src={post.picUrl}
                wrapped
                alt="PostImage"
                onClick={() => {
                  timer = setTimeout(() => {
                    !prevent && setShowImageModal(true)
                    prevent = false
                  }, delay)
                }}
              />
              <Transition.Group animation="fade" duration={500}>
                {showHeart && (
                  <Icon
                    size="huge"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translateX(-50%) translateY(-50%)',
                      filter: 'drop-shadow(0 0 20px gray)'
                    }}
                    color="teal"
                    name="heart"
                  />
                )}
              </Transition.Group>
            </div>
          )}

          <Card.Content extra>
            <Icon
              loading={liking}
              disabled={liking}
              name={liking ? 'circle notched' : isLiked ? 'heart' : 'heart outline'}
              color="red"
              size="large"
              style={{ cursor: 'pointer' }}
              onClick={async () => {
                setLiking(true)
                await likePost(post._id, user._id, setLikes, isLiked ? false : true)
                setLiking(false)
              }}
            />

            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
                  </span>
                )
              }
            />

            {likes.length === 0 && <span>No likes</span>}

            {comments.length > 0 && (
              <Comment.Group>
                {comments.map((comment) => (
                  <PostComments
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    user={user}
                    setComments={setComments}
                  />
                ))}
              </Comment.Group>
            )}

            <CommentInputField user={user} postId={post._id} setComments={setComments} />
          </Card.Content>
        </Card>
      </Segment>
    </>
  )
}

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query
    const { token } = parseCookies(ctx)
    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token }
    })

    return { post: res.data }
  } catch (error) {
    return { errorLoading: true }
  }
}

export default PostPage
