import React, { Component } from "react";
import { app } from "../../../App";
import { KeyUtils } from "slate";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddComment from "@material-ui/icons/AddComment";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

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
    const tagOptions = this.state.tagOptions.map((option, index) => (
      <div className="formCheck" key={index}>
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
      <Card>
        <TextField
          id="Comment"
          placeholder="Here's my comment"
          value={this.state.value}
          onChange={this.handleCommentChange}
          onKeyPress={this.onInputKeyPress}
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AddComment />
              </InputAdornment>
            )
          }}
        />

        {tagOptions}
        <span>
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={this.handleCancel}
          >
            Cancel
          </Button>
        </span>
      </Card>
    );
  }

  /* Allows for enter to be pressed to submit a comment */
  onInputKeyPress = e => {
    if (e.key === "Enter") {
      this.handleSubmit(e);
      e.preventDefault();
    }
  };

  handleCancel = event => {
    const { editor } = app;
    const tempInline = editor.value.document.findDescendant(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === this.state.tempKey
    );

    editor.unwrapInlineByKey(tempInline.key);
    this.props.finishCommenting();
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
    this.getAndWrapCommentData();
    this.props.finishCommenting();
  };

  /* Uses the temporary inline to get real-time selection, and then rewraps. */
  getAndWrapCommentData = async () => {
    const { editor } = app;
    const { value } = editor;

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
}
export default AddCommentForm;
