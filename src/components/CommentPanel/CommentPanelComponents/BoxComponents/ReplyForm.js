import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class ReplyForm extends Component {
  state = {
    replyValue: ""
  };

  render() {
    if (this.props.replying) {
      return (
        <div>
          <form>
            <TextField
              label="Reply"
              variant="outlined"
              margin="normal"
              value={this.state.replyValue}
              onChange={this.changeReplyValue}
            />
          </form>
          <Button color="secondary" variant="outlined" onClick={this.onSubmit}>
            Submit
          </Button>
        </div>
      );
    } else {
      return (
        <span>
          <Button
            color="secondary"
            variant="outlined"
            onClick={this.props.beginReplying}
          >
            Reply
          </Button>
          {this.props.viewingReplies ? (
            <Button onClick={this.props.hideReplies}>Hide all</Button>
          ) : null}
        </span>
      );
    }
  }

  onClick = e => {
    e.stopPropagation();
  };

  onSubmit = e => {
    this.props.addReply(this.state.replyValue);
    this.setState({ replyValue: "" });
  };

  changeReplyValue = e => {
    this.setState({ replyValue: e.target.value });
  };
}

export default ReplyForm;
