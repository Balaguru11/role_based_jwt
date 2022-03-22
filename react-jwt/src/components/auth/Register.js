import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [alertShow, setAtertShow] = useState(false);

  function RegisterHandler(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      setValidated(true);
      call();
      return true;
    }
  }

  const call = () => {
    axios
      .post("http://localhost:8000/auth/register", registerRequest)
      .then((res) => {
        if (res.data.status === "fail" || "error") {
          setError(res.data.msg);
          setAtertShow(true);
          // navigate("/register-verify");
        } else if (res.data.status === "success") {
          setSuccess(res.data.msg);
          setAtertShow(true);
          navigate("/register-verify");
        } else {
          // console.log(res);
          setAtertShow(true);
          setError(res.errors[0].msg);
        }
      })
      .catch((err) => {
        console.log(err);
        // setError(err.message);
        // setAtertShow(true);
      });
  };

  let registerRequest = {
    role: role,
    email: email,
    mobile: mobile,
    username: username,
    password: password,
  };

  function dismissAlert() {
    setAtertShow(false);
    setError("");
    setSuccess("");
  }

  return (
    <Form noValidate validated={validated} onSubmit={RegisterHandler}>
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
          <option>--Select One--</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Employee">Employee</option>
          <option value="School">School</option>
        </Form.Select>
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
          Password should be 8 characters in length and should contain upper,
          lower and special characters.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email Id:</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Email Id is not valid.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="mobile" className="mb-3">
        <Form.Label>Mobile Number:</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter a valid 10 Digit Mobile No."
          required
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Please provide a valid 10 Digit Mobile Number.
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Register
      </Button>
    </Form>
  );
}

export default Register;
