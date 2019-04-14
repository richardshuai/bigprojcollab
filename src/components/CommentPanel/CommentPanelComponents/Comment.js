import React, { Component } from "react";

class Comment extends Component {
  render() {
    return (
      <div>
        <h1> {this.props.suggestion} </h1>
      </div>
    );
  }
}

export default Comment;
