import React from "react";
import AccVerification from "../components/auth/AccVerification";
import { Row, Col } from "react-bootstrap";

function LoginPage() {
  return (
    <>
      <Row className="pt-3 justify-content-md-center">
        <Col md="5">
          <h3>Verify yoour Email Id</h3>
          <p>You must have received an Email with the Security Code.</p>
          <hr />
          <AccVerification />
        </Col>
      </Row>
    </>
  );
}

export default LoginPage;
