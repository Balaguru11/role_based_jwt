import React from "react";
import { Row, Col, Badge } from "react-bootstrap";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import MetaData from "../components/layouts/MetaData";

function HomePage() {
  return (
    <>
      <MetaData title={"JWT Project"} />
      <Row className="d-flex">
        <Col className="p-5 m-5">
          <h3>
            <Badge pill bg="primary">
              User Login
            </Badge>
          </h3>
          <hr />
          <Login />
        </Col>
        <Col className="p-5 m-5">
          <h3>
            <Badge pill bg="success">
              User Registration
            </Badge>
          </h3>
          <hr />
          <Register />
        </Col>
      </Row>
    </>
  );
}

export default HomePage;
