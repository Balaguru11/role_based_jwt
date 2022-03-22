import React from "react";
import CreatePost from "../components/posts/CreatePost";
import { Row, Col } from "react-bootstrap";
import MetaData from "../components/layouts/MetaData";

function NewPostsPage() {
  return (
    <>
      <MetaData title={"Create New Post"} />
      <Row className="m-3 pt-3 justify-content-md-center">
        <Col md="auto">
          <h3>Create A New Post</h3>
          <hr />
          <CreatePost />
        </Col>
      </Row>
    </>
  );
}

export default NewPostsPage;
