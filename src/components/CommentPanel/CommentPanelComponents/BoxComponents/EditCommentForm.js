import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { getData } from "../../../Utils/GetData";
import { app } from "../../../../App";

/* Editing comments works by initializing state with the previous comment (given in props), 
    changing this state as edits are being made, and rewrapping the inline with the new data on submit. */
class EditCommentForm extends Component {
  state = {
    tagOptions: ["Grammar", "Theme", "Content"],
    inputSuggValue: this.props.comment.suggestion,
    newTags: this.props.comment.tags
  };

  render() {
    const comment = this.props.comment;
    const tagCheckbox = this.state.tagOptions.map(option => (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.newTags.includes(option)}
              onChange={this.handleTagCheck.bind(this, option)}
            >
              {option}
            </Checkbox>
          }
          label={option}
        />
      </div>
    ));

    return (
      <Card>
        <div>
          Currently editing (any details can be added):{" "}
          <em>{comment.quoted.slice(0, 50) + "..."}</em>
        </div>
        <Input value={this.state.inputSuggValue} onChange={this.onEditInput} />
        <Button variant="outlined" color="primary" onClick={this.submitEdit}>
          Update
        </Button>
        {tagCheckbox}
      </Card>
    );
  }

  onEditInput = e => {
    this.setState({ inputSuggValue: e.target.value });
  };

  handleTagCheck = (option, event) => {
    const newTags = this.state.newTags;

    // Seemingly backwards because event.target.checked describes the state AFTER the change in checkbox?
    if (!event.target.checked) {
      this.setState({
        newTags: newTags.filter(element => element !== option)
      });
    } else {
      this.setState({
        newTags: [...newTags, option]
      });
    }
  };

  submitEdit = async () => {
    const { editor } = app;

    // First, make sure the comment info is fully updated.
    await this.props.scanDocument();
    const prevComment = this.props.comment;

    // Gather data with new suggestion to be wrapped inline
    const data = getData(prevComment);
    data.tags = this.state.newTags;
    data.suggestion = this.state.inputSuggValue;

    // Get the first node in the document that matches uniqueKey.
    // Warning: uniqueKey isn't unique with splitting lines.
    const target = editor.value.document.findDescendant(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === prevComment.uniqueKey
    );

    // Replace node. Specify inline, data, nodes (children).
    await editor.replaceNodeByKey(target.key, {
      object: "inline",
      type: "comment",
      data: data,
      nodes: target.nodes
    });

    // Scan document and return to default view.
    this.props.scanDocument();
    this.props.finishEditing();
  };
}

export default EditCommentForm;
