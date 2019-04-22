import React, { Component } from "react";
import { app } from "../../../App";

class CommentBox extends Component {
  state = {
    creator: "Teacher",
    time: "date commented",
    quoted: "Highlighted Text",
    comment: "The Comment",
    details: "tags, etc",
    quotedCollapsed: true
  };

  render() {
    return (
      <div class="card" onClick={this.pointToComment}>
        <div class="card-body">
          <h5 class="card-title">{this.state.creator} </h5>
          <h6 class="card-subtitle mb-2 text-muted">{this.state.time}</h6>
          <p class="card-text">
            <em>
              {this.state.quotedCollapsed
                ? this.processCollapsed()
                : this.props.quoted}
            </em>
          </p>

          <button
            type="button"
            class="btn btn-secondary"
            onClick={this.onClickQuotedCollapse}
          >
            {this.state.quotedCollapsed ? "Expand" : "Collapse"}
          </button>

          <p class="card-text">{this.props.suggestion}</p>
          <p
            class="card-text"
            style={{ color: "#aaaacc" }}
            onClick={this.updateComment}
          >
            Update Comment
          </p>
          <p class="card-text">Reply</p>
          <p class="card-text">{this.state.details}</p>
        </div>
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

  updateComment = event => {
    const newSuggestion = window.prompt("Updated suggestion?");
    this.props.suggestion = newSuggestion;
  };

  onClickQuotedCollapse = event => {
    this.setState({ quotedCollapsed: !this.state.quotedCollapsed });
  };

  processCollapsed = () => {
    if (this.props.quoted.length > 30) {
      return this.props.quoted.slice(0, 30) + "...";
    }
    return this.props.quoted;
  };
}

export default CommentBox;
