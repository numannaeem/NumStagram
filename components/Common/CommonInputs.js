import React from 'react'
import { Form, Button, Message, TextArea } from 'semantic-ui-react'

function CommonInputs({
  update,
  user: { bio, facebook, instagram, youtube, twitter },
  handleChange,
  showSocialLinks,
  setShowSocialLinks
}) {
  return (
    <>
      <Form.Field
        label="Bio"
        control={TextArea}
        name="bio"
        value={bio}
        onChange={handleChange}
      />

      <Button
        content={`${update ? 'Update' : 'Add'} Social Links`}
        icon={showSocialLinks ? 'caret up' : 'caret down'}
        basic
        type="button"
        onClick={() => setShowSocialLinks(!showSocialLinks)}
      />

      {showSocialLinks && (
        <>
          <Message
            icon="attention"
            info
            size="small"
            header="Social media links are optional"
            content="Format: 'domainname.com/youraccount'"
          />
          <Form.Input
            icon="facebook f"
            iconPosition="left"
            name="facebook"
            value={facebook}
            onChange={handleChange}
          />

          <Form.Input
            icon="twitter"
            iconPosition="left"
            name="twitter"
            value={twitter}
            onChange={handleChange}
          />

          <Form.Input
            icon="instagram"
            iconPosition="left"
            name="instagram"
            value={instagram}
            onChange={handleChange}
          />

          <Form.Input
            icon="youtube"
            iconPosition="left"
            name="youtube"
            value={youtube}
            onChange={handleChange}
          />
        </>
      )}
    </>
  )
}

export default CommonInputs
