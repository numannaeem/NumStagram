import React, { useState } from 'react'
import {
  Comment,
  Card,
  Icon,
  Image,
  Transition,
  Button,
  Popup,
  Header,
  Modal
} from 'semantic-ui-react'
import PostComments from './PostComments'
import CommentInputField from './CommentInputField'
import calculateTime from '../../utils/calculateTime'
import Link from 'next/link'
import { deletePost, likePost } from '../../utils/postActions'
import LikesList from './LikesList'
import ImageModal from './ImageModal'
import NoImageModal from './NoImageModal'
import ImageOnlyModal from './ImageOnlyModal'
import Linkify from 'linkifyjs/react'

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes)
  const [liking, setLiking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showHeart, setShowHeart] = useState(false)

  const isLiked =
    likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0

  const [comments, setComments] = useState(post.comments)

  const [showModal, setShowModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

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
      <Modal
        open={showModal}
        closeIcon
        closeOnDimmerClick
        size="large"
        onClose={() => setShowModal(false)}
      >
        <Modal.Content>
          {post.picUrl ? (
            <ImageModal {...addPropsToModal()} />
          ) : (
            <NoImageModal {...addPropsToModal()} />
          )}
        </Modal.Content>
      </Modal>

      <Modal
        size="small"
        basic
        open={showImageModal}
        onClose={() => setShowImageModal(false)}
        closeIcon
        closeOnDimmerClick
      >
        <ImageOnlyModal picUrl={post.picUrl} />
      </Modal>

      <>
        <Card color="teal" fluid>
          <Card.Content>
            <Image floated="left" src={post.user.profilePicUrl} avatar />

            {(user.role === 'root' || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      avatar
                      src="/deleteIcon.svg"
                      style={{ cursor: 'pointer' }}
                      size="tiny"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible!</p>

                  <Button
                    loading={deleting}
                    disabled={deleting}
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={async () => {
                      setDeleting(true)
                      await deletePost(post._id, setPosts, setShowToastr)
                      setDeleting(false)
                    }}
                  />
                </Popup>
              </>
            )}

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
              <Linkify options={{ target: 'blank' }}>{post.text}</Linkify>
            </Card.Description>
          </Card.Content>
          {post.picUrl && (
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                onDoubleClick={async () => {
                  if (!liking) {
                    clearTimeout(timer)
                    prevent = true
                    if (!isLiked) {
                      setShowHeart(true)
                      setTimeout(() => setShowHeart(false), 700)
                    }
                    setLiking(true)
                    await likePost(post._id, user._id, setLikes, isLiked ? false : true)
                    setLiking(false)
                  }
                }}
                src={post.picUrl}
                style={{
                  objectFit: 'cover',
                  minWidth: '100%',
                  cursor: 'pointer',
                  maxHeight: '70vh',
                  overflow: 'hidden'
                }}
                wrapped
                alt="PostImage"
                onClick={() => {
                  timer = setTimeout(() => {
                    !prevent && setShowImageModal(true)
                    prevent = false
                  }, delay)
                }}
              />
              <Transition.Group animation="fade" duration={400}>
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
                {comments.map(
                  (comment, i) =>
                    i < 3 && (
                      <PostComments
                        key={comment._id}
                        comment={comment}
                        postId={post._id}
                        user={user}
                        setComments={setComments}
                      />
                    )
                )}
              </Comment.Group>
            )}

            {comments.length > 3 && (
              <Button
                content="View More"
                color="teal"
                basic
                size="small"
                compact
                circular
                onClick={() => setShowModal(true)}
              />
            )}

            <CommentInputField user={user} postId={post._id} setComments={setComments} />
          </Card.Content>
        </Card>
      </>
    </>
  )
}

export default CardPost
