import React, { useState } from 'react'
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
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

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes)

  const isLiked =
    likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0

  const [comments, setComments] = useState(post.comments)

  const [showModal, setShowModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

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
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: 'pointer', maxHeight: '70vh', overflow: 'hidden' }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowImageModal(true)}
            />
          )}

          <Card.Content>
            <Image floated="left" src={post.user.profilePicUrl} avatar circular />

            {(user.role === 'root' || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: 'pointer' }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible!</p>

                  <Button
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={() => deletePost(post._id, setPosts, setShowToastr)}
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
                fontSize: '17px',
                letterSpacing: '0.1px',
                wordSpacing: '0.35px'
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon
              name={isLiked ? 'heart' : 'heart outline'}
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
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

            <Icon name="comment outline" style={{ marginLeft: '7px' }} color="blue" />

            {comments.length > 0 &&
              comments.map(
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

            {comments.length > 3 && (
              <Button
                content="View More"
                color="teal"
                basic
                circular
                onClick={() => setShowModal(true)}
              />
            )}

            <Divider hidden />

            <CommentInputField user={user} postId={post._id} setComments={setComments} />
          </Card.Content>
        </Card>
      </>
    </>
  )
}

export default CardPost
