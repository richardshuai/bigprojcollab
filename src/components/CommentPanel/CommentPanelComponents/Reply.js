import React, { Component } from "react";

class Reply extends Component {
  state = {
    replyValue: ""
  };

  render() {
    if (this.props.replying) {
      return (
        <div>
          <form className="card-input" onClick={this.onClickReply}>
            Reply here
            <input type="text" onChange={this.changeReplyValue} />
          </form>
          <button className="submit" onClick={this.onSubmit}>
            Submit
          </button>
        </div>
      );
    } else {
      return (
        <p className="card-text" onClick={this.props.onClick}>
          Reply
        </p>
      );
    }
  }

  onClick = e => {
    e.stopPropagation();
  };

  onSubmit = e => {
    this.props.onSubmit(this.state.replyValue);
    this.setState({ replyValue: "" });
  };

  changeReplyValue = e => {
    this.setState({ replyValue: e.target.value });
  };
}

export default Reply;
