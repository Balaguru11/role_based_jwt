import React from "react";
import Post from "./PostItem";
import PropTypes from "prop-types";

function PostList(props) {
  return (
    <>
      <div className="row">
        {props.postData.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            title={post.title}
            description={post.description}
            visibility={post.visibility}
          />
        ))}
      </div>
    </>
  );
}

PostList.propTypes = {
  postData: PropTypes.object,
};

export default PostList;
