import React from "react";

import PostList from "../components/posts/PostList";

const dummy = [
  {
    id: "1",
    title: "title 1",
    description: "desc 1",
    content: "content 1",
    visibility: "Public",
  },
  {
    id: "2",
    title: "title 2",
    description: "desc 2",
    content: "content 2",
    visibility: "private",
  },
];

function AllPostsPage(props) {
  return (
    <div>
      <p>All Posts</p>
      <PostList postData={dummy} />
    </div>
  );
}

export default AllPostsPage;
