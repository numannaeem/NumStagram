import React, { useState, useRef } from "react";
import { Form, Button, Image, Divider, Message, Icon } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";

function CreatePost({ user, setPosts }) {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0] || null);
      setMediaPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    }

    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const addStyles = () => ({
    textAlign: "center",
    minHeight: "150px",
    maxWidth: "250px",
    border: !media && "1px dotted",
    paddingTop: !media && "60px",
    cursor: "pointer",
    backgroundColor: !media && highlighted ? "lightgray" : "white"
  });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error uploading image");
      }
    }

    await submitNewPost(
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
    window.scrollTo(0, 0)
  };

  return (
    <>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops!"
        />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="What's happening?"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={4}
            width={14}
          />
        </Form.Group>

        <Form.Group>
          <Form.Input
            value={newPost.location}
            name="location"
            onChange={handleChange}
            label="Add Location"
            icon="map marker alternate"
            placeholder="Want to add a location?"
          />

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>

        <div
          onClick={() => inputRef.current.click()}
          style={addStyles()}
          onDragOver={e => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={e => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={e => {
            e.preventDefault();
            setHighlighted(false);

            const droppedFile = Array.from(e.dataTransfer.files);

            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}>
          {media === null ? (
            <>
              <Icon name="plus" size="big" />
              <span>Add image</span>
            </>
          ) : (
            <>
              <Image
                src={mediaPreview}
                alt="PostImage"
                centered
              />
            </>
          )}
        </div>
        <Divider hidden />
        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: "#1DA1F2", color: "white" }}
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost;
