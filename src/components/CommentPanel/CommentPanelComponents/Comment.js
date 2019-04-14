import React, { Component } from "react";
import { app } from "../../../App";

class Comment extends Component {
  render() {
    return (
      <div>
        <h1 onClick={this.pointToComment}> {this.props.suggestion} </h1>
      </div>
    );
  }

  pointToComment = () => {
    const commentNodes = app.editor.value.document.getInlinesByType("comment");

    const target = commentNodes
      .filter(node => node.data.get("uniqueKey") === this.props.uniqueKey)
      .first();
    app.editor.focus();
    app.editor.moveToStartOfNode(target);
  };
}

export default Comment;
