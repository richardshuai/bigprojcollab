import React, { Component } from "react";

export class CommentBox extends Component {
  state = {
    creator: "Teacher",
    time: "date commented",
    quoted: "Highlighted Text",
    comment: "The Comment",
    details: "tags, etc"
  };

  render() {
    return (
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{this.state.creator} </h5>
          <h6 class="card-subtitle mb-2 text-muted">{this.state.time}</h6>
          <p class="card-text">{this.state.quoted}</p>
          <p class="card-text">{this.state.comment}</p>
          <a href="#" class="card-link">
            Reply
          </a>
          <p class="card-text">{this.state.details}</p>
        </div>
      </div>
    );
  }
}

export default CommentBox;
