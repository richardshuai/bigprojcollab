import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils } from "slate";

//Storing comments in app.state as comment data, not the nodes itself.
class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      tags: []
    };
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  retrieveCommentData = async () => {
    const { editor } = app;
    const { value } = editor;

    const suggestion = this.state.comment;
    const tag = this.state.tags;
    const selection = value.selection;
    const start = selection.start;

    const date = new Date();
    const timeStamp = date.getTime();
    const uniqueKey = KeyUtils.create();

    //Comment data
    const data = { uniqueKey, suggestion, timeStamp, start, selection, tag };
    await editor.wrapInline({
      type: "comment",
      data: data,
      key: uniqueKey
    });
    this.addComment(data);
  };
  addComment = commentData => {
    const updatedComments = [...app.state.comments, commentData];

    //Sorting by reverse timestamp
    // updatedComments.sort((a, b) => b.timeStamp - a.timeStamp);

    //Sorting by document order
    updatedComments.sort(this.docOrderComparator);
    app.setState({ comments: updatedComments });
  };

  /* TODO */

  docOrderComparator = (a, b) => {
    if (a.start.isBeforePoint(b.start)) {
      return -1;
    } else if (a.start.isAfterPoint(b.start)) {
      return 1;
    } else {
      return 0;
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    this.props.panel();
    this.retrieveCommentData();
  }
  handleCommentChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      comment: value
    });
  }
  handleCheckboxChange(event) {
    const target = event.target;
    const value = target.checked;
    const name = target.name;

    if (value === true) {
      this.setState(prevState => ({
        tags: [...prevState.tags, name]
      }));
    }
  }
  render() {
    return (
      <div>
        <form>
          <div class="form-group">
            <label for="comment">Comment</label>
            <input
              type="text"
              class="form-control"
              id="comment"
              placeholder="Here's my comment"
              onChange={this.handleCommentChange}
            />
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              name="Grammar"
              type="checkbox"
              value=""
              id="defaultCheck1"
              onChange={this.handleCheckboxChange}
            />
            <label class="form-check-label" for="defaultCheck1">
              Grammar
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              name="Theme"
              type="checkbox"
              value=""
              id="defaultCheck1"
              onChange={this.handleCheckboxChange}
            />
            <label class="form-check-label" for="defaultCheck1">
              Theme
            </label>
          </div>
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              name="Content"
              value=""
              id="defaultCheck2"
              onChange={this.handleCheckboxChange}
            />
            <label class="form-check-label" for="defaultCheck2">
              Content
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
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
