import React from "react";
import { Link } from "react-router-dom";

function MainNavigation() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">
          Logo Here
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse text-right"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-posts">
                My Posts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/create-post">
                Add New Post
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default MainNavigation;
