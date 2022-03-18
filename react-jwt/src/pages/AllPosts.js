import React, { useState, useEffect } from "react";
import PostList from "../components/posts/PostList";
import axios from "axios";

// const dummy = [
//   {
//     id: "1",
//     title: "title 1",
//     description: "desc 1",
//     content: "content 1",
//     visibility: "Public",
//   },
//   {
//     id: "2",
//     title: "title 2",
//     description: "desc 2",
//     content: "content 2",
//     visibility: "private",
//   },
//   {
//     id: "3",
//     title: "title 3",
//     description: "desc 3",
//     content: "content 3",
//     visibility: "private",
//   },
// ];

function AllPostsPage(props) {
  const [Posts, setPosts] = useState([]);

  const base_url = "http://localhost:8000";
  // const getAllPosts = () => {
  //   axios
  //     .get(`${base_url}/post/public`)
  //     .then((res) => {
  //       setPosts(res.data.posts);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  useEffect(() => {
    // getAllPosts();
    axios
      .get(`${base_url}/post/public`)
      // .then((res) => res.json())
      // .then((json) => setPosts(json))
      .then((res) => {
        setPosts(res.data.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="row m-3 pt-3">
        <p>All Public and Private Posts</p>
        <PostList postData={Posts} />
      </div>
    </>
  );
}

export default AllPostsPage;
