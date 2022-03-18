import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [featured_image, setFeaturedImage] = useState("");
  const [images, setImages] = useState([]);
  const [visibility, setVisibility] = useState(true);
  const [validated, setValidated] = useState(false);

  function AddNewPost(e) {
    const validate = e.currentTarget;
    if (validate.checkValidity() === false) {
      e.preventDefault();
      e.setDescription();
    }
    setValidated(true);
  }
  let newPostData = { title, description, content, visibility };
  console.log(newPostData);
  useEffect(() => {
    axios
      .post("http://localhost:8000/post/create-post", newPostData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [validated]);

  return (
    <>
      <Form noValidate validated={validated} onSubmit={AddNewPost}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Post Title:</Form.Label>
          <Form.Control
            type="text"
            placeholder="A title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="featured_image">
              <Form.Label>Featured Image:</Form.Label>
              <Form.Control
                type="file"
                value={featured_image}
                onChange={(e) => {
                  setFeaturedImage(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="images">
              <Form.Label>Supporting Images:</Form.Label>
              <Form.Control
                type="file"
                multiple
                value={images}
                onChange={(e) => {
                  setImages(e.target.value);
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Post Description:</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="content" className="mb-3">
          <Form.Label>Post Content:</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Form.Group>
        <Form.Group controlId="visibility" className="mb-3">
          <Form.Label className="mx-2">Post Visibility: </Form.Label>
          <BootstrapSwitchButton
            checked={true}
            onstyle="outline-success"
            offstyle="outline-danger"
            width={100}
            onlabel="Public"
            offlabel="Private"
            onChange={(e) => {
              setVisibility(e.target.checked);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mb-3">
          Create Post
        </Button>
      </Form>
    </>
  );
}

CreatePost.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  content: PropTypes.string,
  featured_image: PropTypes.string,
};

export default CreatePost;
