import React, { Component } from "react";
import { app } from "../../../App";
import Reply from "./Reply";
import ReplyContainer from "./ReplyContainer";
import { Range } from "slate";

class CommentBox extends Component {
  state = {
    quotedCollapsed: true,
    replying: false,
    replies: [],
    viewReplies: false,
    editing: false
  };

  render() {
    return (
      <div className="card" onClick={this.pointToComment}>
        <div className="card-body">
          <div class="row">
            <div class="col-md-10">
              <h5 className="card-title"> Anonymous </h5>
            </div>
            <div class="col-md-1">
              <button
                class="btn btn-min btn-sm dropdown-toggle"
                data-toggle="dropdown"
              >
                <span class="caret" />
              </button>
              <ul class="dropdown-menu">
                <div className="dropdown-item" onClick={this.editComment}>
                  Edit
                </div>
                <div className="dropdown-item" onClick={this.resolveComment}>
                  Resolve
                </div>
                <div
                  className="dropdown-item"
                  onClick={e => this.deleteComment}
                >
                  Delete
                </div>
              </ul>
            </div>
          </div>

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
          <div className="replyBox" onClick={this.preventPoint}>
            <div className="reply">
              <Reply
                replying={this.state.replying}
                onClick={this.makeReply}
                onSubmit={this.addReply}
                replies={this.state.replies}
              />
            </div>
            <div className="showReplies">
              <ReplyContainer
                show={this.state.viewReplies}
                replies={this.state.replies}
                showReplies={this.showReplies}
              />
            </div>
          </div>
          <p className="card-text">
            Tags: {this.props.comment.tags.map(tag => tag + " ")}
          </p>
        </div>
      </div>
    );
  }

  // This can probably be changed now that we're scanning every two seconds.
  // Make sure to call scan document before doing so though.

  preventPoint = e => {
    e.stopPropagation();
  };

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

  makeReply = () => {
    this.setState({ replying: !this.state.replying });
  };

  addReply = replyText => {
    if (replyText === "") {
      return;
    }
    const replies = this.state.replies;
    replies.push(replyText);
    this.setState({ replies: replies });
    this.makeReply();
  };

  showReplies = () => {
    this.setState({ viewReplies: !this.state.viewReplies });
  };

  editComment = e => {
    e.stopPropagation();
    const prevComment = this.props.comment;
    this.props.makeEditable(prevComment);

    // Delete previous comment
    const prevRange = Range.create({
      anchor: prevComment.start,
      focus: prevComment.end
    });

    // Put at very end
    app.editor.unwrapInlineAtRange(prevRange);
  };
}

export default CommentBox;
