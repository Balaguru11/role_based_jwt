import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import { Button, Modal } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

//importing created components here
// import Post from "./components/Post";
import MainNavigation from "./components/layouts/MainNavigation";

//importing pages here
import AllPostsPage from "./pages/AllPosts";
import MyPostsPage from "./pages/MyPosts";
import NewPostsPage from "./pages/NewPost";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AccVerificationPage from "./pages/AccVerificationPage";

function App() {
  return (
    <div className="App container-fluid mb-3">
      <MainNavigation />
      <div className="m-1">
        <Routes>
          <Route path="/" element={<AllPostsPage />} />
          <Route path="/my-posts" element={<MyPostsPage />} />
          <Route path="/create-post" element={<NewPostsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-verify" element={<AccVerificationPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
