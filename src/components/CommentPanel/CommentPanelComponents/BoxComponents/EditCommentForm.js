import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

import { app } from "../../../../App";
import { Range } from "slate";

class EditCommentForm extends Component {
  state = {
    inputSuggValue: this.props.comment.suggestion
  };

  render() {
    const comment = this.props.comment;
    return (
      <Card className="editForm">
        <div>
          <em>{comment.quoted.slice(0, 15) + "..."}</em>
        </div>
        <Input
          className="suggestion"
          value={this.state.inputSuggValue}
          onChange={this.onEditInput}
        />
        <Button
          className="submitEdit"
          variant="outlined"
          color="primary"
          onClick={this.submitEdit}
        >
          Update
        </Button>
      </Card>
    );
  }

  onEditInput = e => {
    this.setState({ inputSuggValue: e.target.value });
  };

  submitEdit = async () => {
    const { editor } = app;

    // First, make sure the comment info is fully updated.
    await this.props.scanDocument();
    const prevComment = this.props.comment;

    // Gather data with new suggestion to be wrapped inline
    const data = this.getData(prevComment, this.state.inputSuggValue);

    // Get the first node in the document that matches uniqueKey.
    // Warning: uniqueKey isn't unique with splitting lines.
    let commentNodes = app.editor.value.document.getInlinesByType("comment");
    let target = commentNodes
      .filter(node => node.data.get("uniqueKey") === prevComment.uniqueKey)
      .first();

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

  getData = (prevComment, newSuggestion) => {
    const uniqueKey = prevComment.uniqueKey;
    const start = prevComment.start;
    const end = prevComment.end;
    const quoted = prevComment.quoted;
    const tags = prevComment.tags;
    const timeStamp = prevComment.timeStamp;
    const suggestion = newSuggestion;

    const data = {
      uniqueKey,
      start,
      end,
      quoted,
      tags,
      timeStamp,
      suggestion
    };
    return data;
  };
}

export default EditCommentForm;
