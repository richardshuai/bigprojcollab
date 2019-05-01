import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils } from "slate";

//Storing comments in app.state as comment data, not the nodes itself.
class CommentForm extends Component {
  state = {
    comment: "",
    tags: []
  };

  retrieveCommentData = async () => {
    const { editor } = app;
    const { value } = editor;

    const suggestion = this.state.comment;
    const tags = this.state.tags;
    const selection = value.selection;
    const start = selection.start;

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
      tags
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
    const target = event.target;
    const value = target.value;

    this.setState({
      comment: value
    });
  };

  handleCheckboxChange = event => {
    const target = event.target;
    const value = target.checked;
    const name = target.name;
    console.log(JSON.stringify(value));
    if (value === true) {
      if (!this.state.tags.includes(name)) {
        this.setState(prevState => ({
          tags: [...prevState.tags, name]
        }));
      }
    } else {
      this.state.tags.splice(this.state.tags.indexOf(name), 1);
    }
    console.log(JSON.stringify(this.state.tags));
  };

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label for="comment">Comment</label>
            <input
              type="text"
              className="form-control"
              id="comment"
              placeholder="Here's my comment"
              onChange={this.handleCommentChange}
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              name="Grammar"
              type="checkbox"
              value=""
              id="defaultCheck1"
              onChange={this.handleCheckboxChange}
            />
            <label className="form-check-label" for="defaultCheck1">
              Grammar
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              name="Theme"
              type="checkbox"
              value=""
              id="defaultCheck1"
              onChange={this.handleCheckboxChange}
            />
            <label className="form-check-label" for="defaultCheck1">
              Theme
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="Content"
              value=""
              id="defaultCheck2"
              onChange={this.handleCheckboxChange}
            />
            <label className="form-check-label" for="defaultCheck2">
              Content
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            onClick={e => this.handleSubmit(e)}
          >
            Submit
          </button>
        </form>
      </div>
    );
  }
}
export default CommentForm;
