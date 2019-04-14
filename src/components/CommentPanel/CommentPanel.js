import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import Comment from "./CommentPanelComponents/Comment";

class CommentPanel extends Component {
  render() {
    return (
      <div>
        <SortByDropdown />
        {this.props.comments.map(comment => (
          <Comment
            suggestion={comment.suggestion}
            uniqueKey={comment.uniqueKey}
          />
        ))}
      </div>
    );
  }
}

export default CommentPanel;
