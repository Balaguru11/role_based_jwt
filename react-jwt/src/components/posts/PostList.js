import React from "react";
import Post from "./PostItem";

function PostList(props) {
  return (
    <div className="col-lg-4 col-sm-10 col-xl-4 col-md-4">
      {props.postData.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.description}
          visibility={post.visibility}
        />
      ))}
    </div>
  );
}

export default PostList;
