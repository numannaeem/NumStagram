import React, { useState, useEffect, useRef } from "react";
import { List, Divider, Message, Checkbox, Form, Button } from "semantic-ui-react";
import catchErrors from "../../utils/catchErrors";
import { passwordUpdate, toggleMessagePopup } from "../../utils/profileActions";

function Settings({ newMessagePopup }) {
  const [passwordFields, showPasswordFields] = useState(false);

  const [popupSetting, setPopupSetting] = useState(newMessagePopup);

  const [success, setSuccess] = useState(false);
  const [popupError, setPopupError] = useState(null)

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  useEffect(() => {
    popupError && setTimeout(() => setPopupError(null), 3000);
  }, [popupError]);

  return (
    <>
      {success && (
        <>
          <Message success icon="check circle" header="Updated Successfully" />
          <Divider hidden />
        </>
      )}
      {popupError &&
        <>
          <Message icon="meh" error header="Oops!" content={popupError} />
          <Divider hidden />
        </>
      }

      <List size="huge">
        <List.Item>
          <List.Icon name="user secret" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              onClick={() => showPasswordFields(!passwordFields)}
              as="a"
              content="Update Password"
            />
          </List.Content>

          {passwordFields && (
            <UpdatePassword
              setSuccess={setSuccess}
              showPasswordFields={showPasswordFields}
            />
          )}
        </List.Item>
        <Divider />

        <List.Item>
          <List.Icon name="paper plane outline" size="large" verticalAlign="middle" />

          <List.Content>
            <List.Header
              as="a"
              content="Show New Message Popup?"
            />
          </List.Content>

          <div style={{ marginTop: "10px" }}>
            Control whether a pop-up should appear when you recieve a new message.
            <br />
            <br />
            <Checkbox
              checked={popupSetting}
              toggle
              onChange={() => {
                try {
                  toggleMessagePopup(popupSetting, setPopupSetting, setSuccess)
                }
                catch (error) {
                  setPopupError(catchErrors(error))
                }
              }}
            />
          </div>
        </List.Item>

        <Divider />
      </List>
    </>
  );
}

const UpdatePassword = ({ setSuccess, showPasswordFields }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState(null);

  const [userPasswords, setUserPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [typed, showTyped] = useState({
    field1: false,
    field2: false
  });

  const { field1, field2 } = typed;

  const { currentPassword, newPassword } = userPasswords;

  const handleChange = e => {
    const { name, value } = e.target;
    setUserPasswords(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    errorMsg && setTimeout(() => setError(null), 5000);
  }, [errorMsg]);

  return (
    <>
      <Form
        error={errorMsg !== null}
        loading={loading}
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          try {

            await passwordUpdate(setSuccess, userPasswords);
            showPasswordFields(false);

          } catch (error) {
            setError(catchErrors(error))
          }
          setLoading(false);

        }}
      >
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: "eye",
                circular: true,
                link: true,
                onClick: () => showTyped(prev => ({ ...prev, field1: !field1 }))
              }}
              type={field1 ? "text" : "password"}
              iconPosition="left"
              label="Current Password"
              placeholder="Enter current Password"
              name="currentPassword"
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              icon={{
                name: "eye",
                circular: true,
                link: true,
                onClick: () => showTyped(prev => ({ ...prev, field2: !field2 }))
              }}
              type={field2 ? "text" : "password"}
              iconPosition="left"
              label="New Password"
              placeholder="Enter New Password"
              name="newPassword"
              onChange={handleChange}
              value={newPassword}
            />

            {/* BUTTONS */}

            <Button
              disabled={loading || currentPassword === "" || newPassword === ""}
              compact
              icon="configure"
              type="submit"
              color="teal"
              content="Confirm"
            />

            <Button
              disabled={loading}
              compact
              icon="cancel"
              type="button"
              content="Cancel"
              onClick={() => showPasswordFields(false)}
            />

            <Message icon="meh" error header="Oops!" content={errorMsg} />
          </List.Item>
        </List.List>
      </Form>
      <Divider hidden />
    </>
  );
};

export default Settings;
