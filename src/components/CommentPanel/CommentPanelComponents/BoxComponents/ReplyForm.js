import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class ReplyForm extends Component {
  state = {
    replyValue: ""
  };

  render() {
    return (
      <span>
        <form>
          <Button color="secondary" variant="outlined" onClick={this.onSubmit}>
            Reply
          </Button>
          <TextField
            label="Reply"
            multiline
            variant="outlined"
            margin="dense"
            value={this.state.replyValue}
            onChange={this.changeReplyValue}
          />
        </form>
      </span>
    );
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
