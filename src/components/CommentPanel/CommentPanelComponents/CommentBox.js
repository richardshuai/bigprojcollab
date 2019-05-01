import React, { Component } from "react";
import { app } from "../../../App";

class CommentBox extends Component {
  state = {
    quotedCollapsed: true
  };

  render() {
    return (
      <div className="card" onClick={this.pointToComment}>
        <div className="card-body">
          <h5 className="card-title"> Anonymous </h5>
          <h6 className="card-subtitle mb-2 text-muted">
            {new Date(this.props.comment.timeStamp).toString()}
          </h6>
          <p className="card-text">
            <em>
              {this.state.quotedCollapsed
                ? this.processCollapsed()
                : this.props.comment.quoted}
            </em>
          </p>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.onClickQuotedCollapse}
          >
            {this.state.quotedCollapsed ? "Expand" : "Collapse"}
          </button>

          <p className="card-text">{this.props.comment.suggestion}</p>
          <p
            className="card-text"
            style={{ color: "#aaaacc" }}
            onClick={this.updateComment}
          >
            Update Comment
          </p>
          <p className="card-text">Reply</p>
          <p className="card-text">
            Tags: {this.props.comment.tags.map(tag => tag + " ")}
          </p>
        </div>
      </div>
    );
  }

  // This can probably be changed now that we're scanning every two seconds.
  // Make sure to call scan document before doing so though.
  pointToComment = () => {
    const commentNodes = app.editor.value.document.getInlinesByType("comment");

    const target = commentNodes
      .filter(
        node => node.data.get("uniqueKey") === this.props.comment.uniqueKey
      )
      .first();
    app.editor.focus();
    app.editor.moveToStartOfNode(target);
  };

  onClickQuotedCollapse = event => {
    this.setState({ quotedCollapsed: !this.state.quotedCollapsed });
  };

  processCollapsed = () => {
    if (this.props.comment.quoted.length > 30) {
      return this.props.comment.quoted.slice(0, 30) + "...";
    }
    return this.props.comment.quoted;
  };
}

export default CommentBox;
