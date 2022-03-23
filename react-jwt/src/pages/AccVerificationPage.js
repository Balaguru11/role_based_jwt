import React from "react";
import AccVerification from "../components/auth/AccVerification";
import { Row, Col } from "react-bootstrap";
import MetaData from "../components/layouts/MetaData";
import PropTypes from "prop-types";

function LoginPage(props) {
  return (
    <>
      <MetaData title={"Email Verification"} />
      <Row className="pt-3 justify-content-md-center">
        <Col md="5">
          <h3>Verify your Email Id</h3>
          <p>
            Enter the verification code you have received to the registered
            email id.
          </p>
          <hr />
          <AccVerification user_id={props.user_id} />
        </Col>
      </Row>
    </>
  );
}

LoginPage.propTypes = {
  user_id: PropTypes.string,
};

export default LoginPage;
