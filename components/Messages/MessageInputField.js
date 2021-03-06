import React, { useState } from 'react'
import { Form, Segment } from 'semantic-ui-react'

function MessageInputField({ sendMsg, dummy }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <Segment secondary color="teal" attached="bottom">
        <Form
          reply
          onSubmit={(e) => {
            setLoading(true)
            e.preventDefault()
            !dummy && sendMsg(text)
            setText('')
            setLoading(false)
          }}
        >
          <Form.Input
            size="large"
            placeholder="Send New Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            action={{
              color: 'blue',
              icon: 'telegram plane',
              disabled: text === '',
              loading: loading
            }}
          />
        </Form>
      </Segment>
    </div>
  )
}

export default MessageInputField
