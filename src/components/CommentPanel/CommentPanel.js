import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import Comment from "./CommentPanelComponents/Comment";

class CommentPanel extends Component {
  render() {
    console.log(this.props.comments.length);
    return (
      <div>
        <SortByDropdown />
        {this.props.comments.map(comment => (
          <Comment suggestion={comment.suggestion} />
        ))}
      </div>
    );
  }
}

export default CommentPanel;
