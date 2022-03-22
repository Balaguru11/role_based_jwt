import React from "react";
import Register from "../components/auth/Register";
import { Row, Col } from "react-bootstrap";
import MetaData from "../components/layouts/MetaData";

function RegisterPage() {
  return (
    <>
      <MetaData title={"User Registration"} />
      <Row className="pt-3 justify-content-md-center">
        <Col md="5">
          <h3>Registration</h3>
          <hr />
          <Register />
        </Col>
      </Row>
    </>
  );
}

export default RegisterPage;
