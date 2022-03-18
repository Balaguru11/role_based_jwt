import axios from "axios";
import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

function Register() {
  const [validated, setValidated] = useState(false);
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function RegisterHandler(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  }

  let registerRequest = {
    role: role,
    email: email,
    mobile: mobile,
    username: username,
    password: password,
  };

  useEffect(() => {
    axios
      .post("http://localhost:8000/auth/register", registerRequest)
      .then((res) => {
        console.log(`${res} Created`);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [validated]);

  return (
    <Form noValidate validated={validated} onSubmit={RegisterHandler}>
      <Form.Group controlId="role">
        <Form.Label>Role:</Form.Label>
        <Form.Select
          aria-label="role"
          required
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option>Select One</option>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Employee">Employee</option>
          <option value="School">School</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="username">
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
      <Form.Group controlId="password">
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
      <Form.Group controlId="email">
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
      <Form.Group controlId="mobile">
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
