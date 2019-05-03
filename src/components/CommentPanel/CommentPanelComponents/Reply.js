import React, { Component } from "react";
import { app } from "../../../App";

class Reply extends Component {
  state = {
    replyValue: ""
  };

  render() {
    if (this.props.replying) {
      return (
        <div>
          <form className="card-input">
            Reply here
            <input
              type="text"
              onChange={this.changeReplyValue}
              onClick={this.onClick}
            />
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

  onSubmit = e => {
    this.props.onSubmit(this.state.replyValue);
    console.log("hi");
    console.log(this.props);
    this.setState({ replyValue: "" });
  };

  onClick = e => {
    e.preventDefault();
  };

  changeReplyValue = e => {
    this.setState({ replyValue: e.target.value });
  };
}

export default Reply;
