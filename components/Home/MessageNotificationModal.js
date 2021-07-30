import React, { useState } from 'react';
import { Form, Modal, Comment } from 'semantic-ui-react';
import Link from 'next/link';
import calculateTime from '../../utils/calculateTime';

function MessageNotificationModal({
  socket,
  showNewMessageModal,
  newMessageModal,
  newMessageReceived,
  user,
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const onModalClose = () => showNewMessageModal(false);

  const formSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    if (socket.current) {
      socket.current.emit('sendMsgFromNotification', {
        userId: user._id,
        msgSendToUserId: newMessageReceived.sender,
        msg: text,
      });

      socket.current.on('msgSentFromNotification', () => {
        showNewMessageModal(false);
      });
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        size="small"
        open={newMessageModal}
        onClose={onModalClose}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header
          content={`New Message from ${newMessageReceived.senderName}`}
        />

        <Modal.Content>
          <Comment.Group>
            <Comment>
              <Comment.Avatar
                as="a"
                src={newMessageReceived.senderProfilePic}
              />
              <Comment.Content>
                <Comment.Author as="a">
                  {newMessageReceived.senderName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{calculateTime(newMessageReceived.date)}</div>
                </Comment.Metadata>
                <Comment.Text>{newMessageReceived.msg}</Comment.Text>
                <Form reply onSubmit={formSubmit}>
                  <Form.Input
                    size="large"
                    placeholder="Reply"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    action={{
                      color: 'blue',
                      icon: 'telegram plane',
                      disabled: text === '',
                      loading: loading,
                    }}
                  />
                </Form>
              </Comment.Content>
            </Comment>
          </Comment.Group>

          <div style={{ marginTop: '5px' }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`}>
              <a>View All Messages</a>
            </Link>

            <br />
            <hr />
            <Instructions username={user.username} />
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

const Instructions = ({ username }) => (
  <p>
    <b>
      If you do not want this popup to appear when you receive a new message
    </b>
    <br />
    You can disable it by going to
    <Link href={`/${username}`}>
      <a> Account </a>
    </Link>
    and clicking on the Settings Tab.
  </p>
);

export default MessageNotificationModal;
