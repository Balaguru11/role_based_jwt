import React from "react";
import Login from "../components/auth/Login";
import { Row, Col } from "react-bootstrap";

function LoginPage() {
  return (
    <>
      <Row className="pt-3 justify-content-md-center">
        <Col md="5">
          <h3>User Login</h3>
          <hr />
          <Login />
        </Col>
      </Row>
    </>
  );
}

export default LoginPage;
