import React, { Component } from "react";
import Card from "@material-ui/core/Card";

import ReplyForm from "./BoxComponents/ReplyForm";
import ReplyContainer from "./BoxComponents/ReplyContainer";
import EditCommentForm from "./BoxComponents/EditCommentForm";
import shortid from "shortid";

class CommentBox extends Component {
  state = {
    editing: false,
    quotedIsCollapsed: true,
    replies: [],
    viewingReplies: false,
    numVisibleReplies: 1
  };

  render() {
    if (this.state.editing) {
      return (
        <EditCommentForm
          comment={this.props.comment}
          scanDocument={this.props.scanDocument}
          finishEditing={this.finishEditing}
        />
      );
    }

    /* Conditionally render reply container */
    let replyContainer = null;
    if (this.props.isExpanded) {
      replyContainer = (
        <Card className="replyBox" onClick={this.preventPoint}>
          <div>
            <ReplyForm addReply={this.addReply} />
          </div>
          <div>
            <ReplyContainer
              replies={this.state.replies}
              viewingReplies={this.state.viewingReplies}
              hideReplies={this.hideReplies}
              numVisibleReplies={this.state.numVisibleReplies}
              seeMoreReplies={this.seeMoreReplies}
            />
          </div>
        </Card>
      );
    } else {
      replyContainer = null;
    }

    /* Generate text with the fragments included */
    let quoted = this.props.comment.quoted + this.displayFragments();
    let processedQuote = quoted.split("\n").map(fragQuote => (
      <span key={shortid.generate()}>
        {fragQuote}
        <br />
      </span>
    ));

    return (
      <div className="card" onClick={this.onClickCommentBox}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-10">
              <h5 className="card-title"> Anonymous </h5>
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-min btn-sm dropdown-toggle"
                data-toggle="dropdown"
                onClick={this.preventPoint}
              >
                <span className="caret" />
              </button>
              <ul className="dropdown-menu">
                <div className="dropdown-item" onClick={this.beginEditing}>
                  Edit
                </div>
                <div className="dropdown-item" onClick={this.resolveComment}>
                  Resolve
                </div>
                <div className="dropdown-item" onClick={this.deleteComment}>
                  Delete
                </div>
              </ul>
            </div>
          </div>

          <h6 className="card-subtitle mb-2 text-muted">
            {new Date(this.props.comment.timeStamp).toString()}
          </h6>
          <div className="card-text">
            <em>
              {this.state.quotedIsCollapsed
                ? this.truncate(quoted)
                : processedQuote}
            </em>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.toggleQuotedCollapse}
          >
            {this.state.quotedIsCollapsed ? "Expand" : "Collapse"}
          </button>
          <p className="card-text">{this.props.comment.suggestion}</p>
          <p className="card-text">
            Tags: {this.props.comment.tags.slice(1).map(tag => tag + " ")}
          </p>
        </div>
        {replyContainer}
      </div>
    );
  }

  preventPoint = e => {
    e.stopPropagation();
  };

  onClickCommentBox = () => {
    this.props.pointToComment(this.props.id);
  };

  toggleQuotedCollapse = event => {
    this.setState({ quotedIsCollapsed: !this.state.quotedIsCollapsed });
    event.stopPropagation();
  };

  truncate = quoted => {
    if (quoted.length > 30 || quoted.includes("\n")) {
      return quoted.slice(0, 30) + "...";
    }
    return quoted;
  };

  displayFragments = () => {
    if (this.props.comment.fragments.length > 0) {
      return this.props.comment.fragments
        .map(fragment => fragment.quoted)
        .join("");
    } else {
      return "";
    }
  };

  addReply = replyText => {
    if (replyText === "") {
      return;
    }
    const replies = this.state.replies;
    replies.push(replyText);
    this.setState({ replies: replies });
    this.seeMoreReplies(1);
  };

  hideReplies = () => {
    this.setState({ viewingReplies: false, numVisibleReplies: 0 });
  };

  seeMoreReplies = num => {
    this.setState({
      viewingReplies: true,
      numVisibleReplies: Math.min(
        this.state.numVisibleReplies + num,
        this.state.replies.length
      )
    });
  };

  beginEditing = () => {
    this.setState({ editing: true });
  };

  finishEditing = () => {
    this.setState({ editing: false });
  };
}

export default CommentBox;
