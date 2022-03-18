import React, { useState } from "react";
import { Button, Modal, Card } from "react-bootstrap";
import PropTypes from "prop-types";

function Post(props) {
  const [deleteModal, setDeleteModal] = useState(false);

  function viewHandler() {
    console.log("Clicked");
  }

  function deleteButtonHandler() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function deleteConfirmHandler() {
    console.log(`Data has been deleted`);
    setDeleteModal(false);
  }

  return (
    <>
      <div className="col-lg-4 col-md-6 col-sm-6 col-xs-10 p-1">
        <Card key={props._id} className="p-2 m-2 rounded shadow">
          <Card.Body>
            <Card.Title>{props.title}</Card.Title>
            <Card.Subtitle className="mt-4">
              Visibility: {props.visibility}
            </Card.Subtitle>
            <hr />
            <Card.Text>{props.description}</Card.Text>
            <Button variant="primary" className="mx-1" onClick={viewHandler}>
              View
            </Button>
            <Button
              variant="danger"
              className="mx-1"
              onClick={deleteButtonHandler}
            >
              Delete
            </Button>
          </Card.Body>
        </Card>
      </div>
      {/* delete Modal */}
      <Modal show={deleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to Delete this Post?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are about to delete a Post. The Process isn&apos;t undoable.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Go back
          </Button>
          <Button variant="primary" onClick={deleteConfirmHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  visibility: PropTypes.string,
  _id: PropTypes.string,
};

Post.defaultProps = {
  title: "Dummy Post",
  desctiption: "Dummy Desc",
  visibility: "Public",
  _id: "00",
};

export default Post;
