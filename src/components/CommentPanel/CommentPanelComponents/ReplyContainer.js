import React, { Component } from "react";

class ReplyContainer extends Component {
  render() {
    if (this.props.show) {
      return (
        <div>
          {this.props.replies.map(reply => (
            <p className="card-text">{reply}</p>
          ))}
          <p className="card-text" onClick={this.props.showReplies}>
            Hide Replies
          </p>
        </div>
      );
    } else {
      if (this.props.replies.length === 0) {
        return <p className="card-text">No Replies</p>;
      } else if (this.props.replies.length === 1) {
        return (
          <p className="card-text" onClick={this.props.showReplies}>
            View Reply
          </p>
        );
      } else {
        return (
          <p className="card-text" onClick={this.props.showReplies}>
            View {this.props.replies.length} Replies
          </p>
        );
      }
    }
  }
}

export default ReplyContainer;
