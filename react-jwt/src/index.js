import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

// Pages
// 1. View all Posts: /
// 2. Create Posts Form: /create-post
// My Posts : /my-posts
// Edit Posts: /edit-post/:id
// Delete Posts: /delete-post/:id
// Login & Register Screen: /login /register
// Reset Password Screen: /reset-password
// Email Verification Screen : /verify-email
// My Profile: /profile
// Create Profile: /create-profile
// Edit Profile: /edit-profile
// Logout : /logout
