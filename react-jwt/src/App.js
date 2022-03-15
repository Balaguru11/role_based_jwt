import react from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";

//importing created components here
import Post from "./components/Post";

function App() {
  return (
    <div className="App m-5">
      <h1 className="display-6">
        <b>All Posts</b>
      </h1>
      <div className="row">
        <Post text="My First Post" desc="My first Description" />
        <Post text="My Second Post" desc="My Second Description" />
        <Post text="My Thrid Post" desc="My Thrid Description" />
      </div>
    </div>
  );
}

export default App;
