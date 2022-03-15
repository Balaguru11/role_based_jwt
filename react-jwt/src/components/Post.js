import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function Post(props) {
  const [deleteModal, setDeleteModal] = useState(false);

  function viewHandler() {
    console.log("Clicked");
    console.log(props.text);
  }

  function deleteButtonHandler() {
    setDeleteModal(true);
  }

  function closeDeleteModal() {
    setDeleteModal(false);
  }

  function deleteConfirmHandler() {
    console.log(`${props.text} has been deleted`);
    setDeleteModal(false);
  }

  return (
    <>
      <div className="col-lg-4 col-sm-10 col-xl-4 col-md-4">
        <div className="card p-3 m-2 rounded">
          <h2 className="display-6">{props.text}</h2>
          <p>{props.desc}</p>
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
          <Modal.Title>Do you want to Delete {props.text}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are about to delete a Post. The Process isn't undoable.
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
