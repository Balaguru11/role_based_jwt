import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

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
      <div className="card p-1 m-2 rounded">
        <div className="card-body">
          <h3 className="card-title">{props.title}</h3>
          <h6 className="card-subtitle mb-2 text-muted">
            Visibility: {props.visibility}
          </h6>
          <p className="card-text">Description: {props.description}</p>
          <div>
            <button className="btn btn-secondary mx-1" onClick={viewHandler}>
              View
            </button>
            <button className="btn btn-danger" onClick={deleteButtonHandler}>
              Delete
            </button>
          </div>
        </div>
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

export default Post;
