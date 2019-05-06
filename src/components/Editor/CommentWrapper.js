import React, { Component } from "react";

class CommentWrapper extends Component {
  render() {
    return (
      <div style={this.props.style} {...this.props.attributes}>
        {this.props.children}
      </div>
    );
  }
}

export default CommentWrapper;
