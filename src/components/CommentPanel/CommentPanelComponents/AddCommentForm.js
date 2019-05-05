import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils } from "slate";

class AddCommentForm extends Component {
  state = {
    value: "",
    tags: ["All"],
    tagOptions: ["Grammar", "Theme", "Content"],
    tempKey: KeyUtils.create()
  };

  /* Ensures that the selection displays a temporary inline highlight to show what
      the user is currently highlighting. Then, this inline is used when actually 
      wrapping data inline */
  componentDidMount() {
    const { editor } = app;
    const { selection } = editor.value;

    editor.wrapInlineAtRange(selection, {
      type: "tempAddComment",
      data: {
        uniqueKey: this.state.tempKey,
        start: selection.start,
        end: selection.end
      }
    });
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

    // Not necessary to filter if there's only one comment being added at a time.
    // Warning: uniqueKey isn't unique with splitting lines.
    const tempInline = value.document.findDescendant(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === this.state.tempKey
    );

    const date = new Date();

    const uniqueKey = this.state.tempKey;
    const start = tempInline.data.get("start").moveToStartOfNode(tempInline);
    const end = tempInline.data.get("end").moveToEndOfNode(tempInline);
    const quoted = value.fragment.text;
    const tags = this.state.tags;
    const suggestion = this.state.value;
    const timeStamp = date.getTime();
    const isFocused = false;

    const data = {
      uniqueKey,
      start,
      end,
      quoted,
      tags,
      timeStamp,
      suggestion,
      isFocused
    };

    // Use the real key to find node, not the data.uniqueKey
    await editor.replaceNodeByKey(tempInline.key, {
      object: "inline",
      type: "comment",
      data: data,
      nodes: tempInline.nodes
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
    this.props.finishCommenting();
    this.getAndWrapCommentData();
  };
}
export default AddCommentForm;
