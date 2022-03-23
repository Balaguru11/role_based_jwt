import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function AccVerification(props) {
  const user_id = props.user_id;
  const [verification_code, setVerification_code] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alert, setAlert] = useState(false);

  // const [verifyValid, setVerifyValid] = useState(false);
  // function VerifyEmailHandler(event) {
  //   const verifyEmail = event.currentTarget;
  //   if (verifyEmail.checkValidity() === false) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //   } else {
  //     event.preventDefault();
  //     setVerifyValid(true);
  //     VerifyEMail();
  //     return true;
  //   }
  // }

  console.log(user_id);

  let verify_body = {
    user_id: user_id,
    verification_code: verification_code,
  };

  function VerifyEmailHandler() {
    if (verification_code != " ") {
      axios
        .post("http://localhost:8000/auth/register-verify", verify_body)
        .then((res) => {
          console.log(res);
          //handle res here
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function dismissAlert() {
    setAlert(false);
    setError("");
    setSuccess("");
  }

  return (
    <>
      <Form onSubmit={VerifyEmailHandler}>
        {error && (
          <Alert variant="danger" onClick={dismissAlert} dismissible>
            <Alert.Heading>{error}</Alert.Heading>
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClick={dismissAlert} dismissible>
            <Alert.Heading>{success}</Alert.Heading>
          </Alert>
        )}
        <Form.Group controlId="v_code" className="mb-3">
          <Form.Label>Verification Code:</Form.Label>
          <Form.Control
            type="v_code"
            placeholder="Enter Verification code here"
            required
            value={verification_code}
            onChange={(e) => {
              setVerification_code(e.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

AccVerification.propTypes = {
  user_id: PropTypes.string,
  verification_code: PropTypes.string,
};
export default AccVerification;
