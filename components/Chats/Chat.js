import React from 'react'
import { Comment, Icon, List } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import calculateTime from '../../utils/calculateTime'

function Chat({ chat, connectedUsers, deleteChat, pc }) {
  const router = useRouter()

  const isOnline = Boolean(
    connectedUsers?.filter((user) => user.userId === chat.messagesWith).length
  )

  return (
    <List.Item
      active={router.query.message === chat.messagesWith}
      onClick={(e) => {
        e.stopPropagation()
        pc
          ? router.replace(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true
            })
          : router.push(`/messages?message=${chat.messagesWith}`, undefined, {
              shallow: true
            })
      }}
    >
      <Comment>
        <Comment.Avatar src={chat.profilePicUrl} />
        <Comment.Content>
          <Comment.Author>
            {chat.name} {isOnline && <Icon name="circle" size="small" color="green" />}
          </Comment.Author>

          <Comment.Metadata
            style={{
              marginLeft: '0',
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '5px'
            }}
          >
            <div>{chat.date && calculateTime(chat.date)}</div>

            <div
              onClick={(e) => {
                e.stopPropagation()
                deleteChat(chat.messagesWith)
              }}
            >
              <Icon name="trash alternate" color="red" size="large" />
            </div>
          </Comment.Metadata>

          <Comment.Text>
            {chat.lastMessage && chat.lastMessage?.length > 20
              ? `${chat.lastMessage.substring(0, 20)}...`
              : chat.lastMessage}
          </Comment.Text>
        </Comment.Content>
      </Comment>
    </List.Item>
  )
}

export default Chat
