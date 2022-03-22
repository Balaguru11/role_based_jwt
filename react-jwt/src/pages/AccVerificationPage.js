import React from "react";
import AccVerification from "../components/auth/AccVerification";
import { Row, Col } from "react-bootstrap";
import MetaData from "../components/layouts/MetaData";
function LoginPage() {
  return (
    <>
      <MetaData title={"Email Verification"} />
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
