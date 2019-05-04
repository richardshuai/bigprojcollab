import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils, Decoration, Mark } from "slate";

//Storing comments in app.state as comment data, not the nodes itself.
class AddCommentForm extends Component {
  state = {
    value: "",
    tags: ["All"],
    tagOptions: ["Grammar", "Theme", "Content"],
    decorations: []
  };

  /* Ensures that the selection displays a temporary highlight to show what
      the user is currently highlighting */
  componentDidMount() {
    const decorations = [];
    const { editor } = app;
    const { selection } = editor.value;
    const mark = Mark.create({ type: "tempAddCommentDecor" });
    const highlightDecor = Decoration.create({
      anchor: selection.start,
      focus: selection.end,
      mark: mark
    });

    this.setState({ decorations: [...decorations, highlightDecor] }, () =>
      editor.withoutSaving(() => {
        editor.setDecorations(this.state.decorations);
      })
    );
  }

  render() {
    /* Generates HTML for tag options */
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

  getAndWrapCommentData = async () => {
    const { editor } = app;
    const { value } = editor;
    const selection = value.selection;
    const date = new Date();

    const uniqueKey = KeyUtils.create();
    const start = selection.start;
    const end = selection.end;
    const quoted = value.fragment.text;
    const tags = this.state.tags;
    const suggestion = this.state.value;
    const timeStamp = date.getTime();

    const data = {
      uniqueKey,
      start,
      end,
      quoted,
      tags,
      timeStamp,
      suggestion
    };

    await editor.wrapInline({
      type: "comment",
      data: data
    });

    this.props.scanDocument();
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

  handleSubmit = event => {
    event.preventDefault();
    const { editor } = app;
    this.props.noneditable();
    this.getAndWrapCommentData();

    // For now, this will actually remove ALL decorations.
    editor.setDecorations([]);
  };
}
export default AddCommentForm;
