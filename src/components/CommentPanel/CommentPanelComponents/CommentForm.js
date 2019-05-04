import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils } from "slate";

//Storing comments in app.state as comment data, not the nodes itself.
class CommentForm extends Component {
  state = {
    value: "",
    tags: ["All"],
    tagOptions: ["Grammar", "Theme", "Content"]
  };

  componentDidMount() {
    if (!(Object.entries(this.props.prevComment).length === 0)) {
      this.setState({ value: this.props.prevComment.suggestion });
    }
  }

  retrieveCommentData = async () => {
    const { editor } = app;
    const { value } = editor;

    const suggestion = this.state.value;
    const tags = this.state.tags;
    const selection = value.selection;
    const start = selection.start;
    const end = selection.end;

    const date = new Date();
    const timeStamp = date.getTime();
    const uniqueKey = KeyUtils.create();
    const quoted = value.fragment.text;

    //Comment data
    const data = {
      quoted,
      uniqueKey,
      suggestion,
      timeStamp,
      start,
      selection,
      tags,
      end
    };

    await editor.wrapInline({
      type: "comment",
      data: data,
      key: uniqueKey
    });
    this.props.scanDocument();
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.noneditable();
    this.retrieveCommentData();
  };

  handleCommentChange = event => {
    const value = event.target.value;
    this.setState({
      value: value
    });
  };

  handleCheckboxChange = event => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    if (value === true) {
      if (!this.state.tags.includes(name)) {
        this.setState(prevState => ({
          tags: [...prevState.tags, name]
        }));
      }
    } else {
      this.state.tags.splice(this.state.tags.indexOf(name), 1);
    }
  };

  render() {
    const tagOptions = this.state.tagOptions.map(option => (
      <div className="formCheck">
        <input
          className="formCheckInput"
          name={option}
          type="checkbox"
          onChange={this.handleCheckboxChange}
        />
        <label className="formCheckLabel">{option}</label>
      </div>
    ));

    return (
      <div>
        <form>
          <div className="form-group">
            <label>Comment</label>
            <input
              type="text"
              className="form-control"
              placeholder="Here's my comment"
              value={this.state.value}
              onChange={this.handleCommentChange}
            />
          </div>
          {tagOptions}
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
export default CommentForm;
