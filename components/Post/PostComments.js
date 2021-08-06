import React, { useRef, useState } from 'react'
import { Comment, Icon, Form } from 'semantic-ui-react'
import calculateTime from '../../utils/calculateTime'
import LikesList from './LikesList'
import {
  deleteComment,
  deleteReply,
  postReply,
  likeComment
} from '../../utils/postActions'

function PostComments({ comment, user, setComments, postId }) {
  const [disabled, setDisabled] = useState(false)
  const [replyDisabled, setReplyDisabled] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [commentReply, setCommentReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [liking, setLiking] = useState(false)
  const [likes, setLikes] = useState(comment.likes)
  const [replies, setReplies] = useState(comment.replies)
  const [showReplies, setShowReplies] = useState(false)

  const isLiked =
    likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0

  const replyRef = useRef()

  return (
    <Comment>
      <Comment.Avatar
        as="a"
        href={`/${comment.user.username}`}
        src={comment.user.profilePicUrl}
      />
      <Comment.Content style={{ position: 'relative' }}>
        <Comment.Author as="a" href={`/${comment.user.username}`}>
          {comment.user.name}
        </Comment.Author>
        <Comment.Metadata>
          {calculateTime(comment.date)}
          <Comment.Actions>
            {(user.role === 'root' || comment.user._id === user._id) && (
              <Comment.Action>
                <Icon
                  disabled={disabled}
                  color="red"
                  name="trash"
                  onClick={async () => {
                    setDisabled(true)
                    await deleteComment(postId, comment._id, setComments)
                    setDisabled(false)
                  }}
                />
              </Comment.Action>
            )}
            <Comment.Action style={{ position: 'absolute', right: '0' }}>
              <Icon
                color="black"
                loading={liking}
                disabled={liking}
                name={liking ? 'circle notched' : isLiked ? 'heart' : 'heart outline'}
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  setLiking(true)
                  await likeComment(
                    postId,
                    comment._id,
                    user._id,
                    setLikes,
                    isLiked ? false : true
                  )
                  setLiking(false)
                }}
              />
            </Comment.Action>
          </Comment.Actions>
        </Comment.Metadata>

        <Comment.Text>{comment.text}</Comment.Text>
        <Comment.Actions>
          {likes.length > 0 && (
            <Comment.Action>
              <LikesList
                commentId={comment._id}
                postId={postId}
                trigger={
                  likes.length > 0 && (
                    <span className="spanLikesList">
                      {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
                    </span>
                  )
                }
              />
            </Comment.Action>
          )}
          <Comment.Action
            active={showReply}
            onClick={() => {
              replyRef.current?.focus()
              setShowReply((prev) => !prev)
            }}
          >
            Reply
          </Comment.Action>
          {Boolean(replies?.length) && (
            <Comment.Action onClick={() => setShowReplies((prev) => !prev)}>
              {!showReplies ? 'View' : 'Hide'} replies
            </Comment.Action>
          )}
        </Comment.Actions>
        {(showReply || loading) && (
          <Form
            reply
            onSubmit={async (e) => {
              setLoading(true)
              e.preventDefault()
              setShowReplies(true)
              await postReply(postId, comment._id, user, commentReply.trim(), setReplies)
              setCommentReply('')
              setShowReply(false)
              setLoading(false)
            }}
          >
            <Form.Input
              autoFocus
              action={{
                color: 'teal',
                compact: true,
                icon: 'check',
                loading: loading,
                disabled: commentReply === '' || loading
              }}
              value={commentReply}
              onChange={(e) => setCommentReply(e.target.value.trimStart())}
              placeholder="Add a reply"
              type="text"
            />
          </Form>
        )}
      </Comment.Content>

      {Boolean(replies?.length) && (
        <Comment.Group collapsed={!showReplies}>
          {replies.map((r) => (
            <Comment key={r._id}>
              <Comment.Avatar
                as="a"
                href={`/${r.user.username}`}
                src={r.user.profilePicUrl}
              />
              <Comment.Content>
                <Comment.Author as="a" as="a" href={`/${r.user.username}`}>
                  {r.user.name}
                </Comment.Author>
                <Comment.Metadata>
                  {calculateTime(r.date)}
                  {(user.role === 'root' || r.user._id === user._id) && (
                    <Comment.Action>
                      <Icon
                        disabled={replyDisabled}
                        color="red"
                        name="trash"
                        onClick={async () => {
                          setReplyDisabled(true)
                          await deleteReply(postId, comment._id, r._id, setReplies)
                          setReplyDisabled(false)
                        }}
                      />
                    </Comment.Action>
                  )}
                </Comment.Metadata>
                <Comment.Text>{r.text}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      )}
    </Comment>
  )
}

export default PostComments
