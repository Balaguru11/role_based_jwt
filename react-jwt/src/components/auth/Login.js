import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();

  const [validated, setValidated] = useState(false);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alertShow, setAlertShow] = useState(false);

  function LoginHandler(event) {
    const loginForm = event.currentTarget;
    if (loginForm.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setValidated(true);
      axios
        .post("http://localhost:8000/auth/login", loginUser)
        .then((res) => {
          if (res.data.status == "fail" || "error") {
            setError(res.data.msg);
            setAlertShow(true);
          } else {
            setSuccess(res.data.msg);
            setAlertShow(true);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function dismissAlert() {
    setAlertShow(false);
    setError("");
    // setSuccess("");
  }

  let loginUser = {
    role: role,
    username: username,
    password: password,
  };

  return (
    <Form noValidate validated={validated} onSubmit={LoginHandler}>
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
      <Form.Group controlId="role" className="mb-3">
        <Form.Label>Role:</Form.Label>
        <Form.Select
          aria-label="role"
          required
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option value="">Select One</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Employee">Employee</option>
          <option value="School">School</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          Select An User Role.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="username" className="mb-3">
        <Form.Label>Username:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Username"
          required
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Username shouls not be blank.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Password should be entered.
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );
}

export default Login;
