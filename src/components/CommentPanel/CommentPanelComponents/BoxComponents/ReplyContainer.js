import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

class ReplyContainer extends Component {
  render() {
    const numLeft = this.props.replies.length - this.props.numVisibleReplies;

    /* Render different reply buttons depending on numLeft */
    let viewReplyButton = null;
    if (numLeft === 0 || numLeft === -1) {
      viewReplyButton = null;
    } else if (numLeft === 1) {
      viewReplyButton = (
        <Button onClick={this.props.seeMoreReplies.bind(this, 3)}>
          View 1 Reply
        </Button>
      );
    } else {
      const numToSee = Math.min(3, numLeft);
      viewReplyButton = (
        <Button onClick={this.props.seeMoreReplies.bind(this, numToSee)}>
          View {numToSee} more ({numLeft} left)
        </Button>
      );
    }

    /* Show only replies that are "past" the current index of comments to see */
    let visibleReplies = null;
    if (this.props.viewingReplies) {
      visibleReplies = (
        <div>
          {this.props.replies.slice(numLeft).map(reply => (
            <Card>{reply}</Card>
          ))}
          <Button onClick={this.props.hideReplies}>Hide Replies</Button>
        </div>
      );
    }

    return (
      <React.Fragment>
        {viewReplyButton}
        {visibleReplies}
      </React.Fragment>
    );
  }
}

export default ReplyContainer;
