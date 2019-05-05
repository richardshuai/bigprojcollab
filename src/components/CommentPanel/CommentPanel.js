import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import AddCommentForm from "./CommentPanelComponents/AddCommentForm";
import CommentBox from "./CommentPanelComponents/CommentBox";
import { app } from "../../App";

export let panel;
class CommentPanel extends Component {
  state = {
    commenting: false,
    prevComment: {},
    expandedID: ""
  };

  componentDidMount() {
    panel = this;
  }

  render() {
    /* Filters and sorts comments to be seen */
    let visibleComments = [];
    if (this.state.sortFn && this.state.filterFn) {
      visibleComments = this.props.comments
        .sort(this.state.sortFn)
        .filter(this.state.filterFn)
        .map(comment => (
          <CommentBox
            comment={comment}
            scanDocument={this.props.scanDocument}
            expandCommentAndFocus={this.expandCommentAndFocus}
            isExpanded={this.state.expandedID === comment.uniqueKey}
            key={comment.uniqueKey}
            id={comment.uniqueKey}
          />
        ));
    }

    return (
      <div>
        <SortByDropdown setSortFn={this.setSortFn} />
        <FilterByTabs setFilterFn={this.setFilterFn} />
        {this.state.commenting ? (
          <AddCommentForm
            finishCommenting={this.finishCommenting}
            scanDocument={this.props.scanDocument}
            prevComment={this.state.prevComment}
          />
        ) : null}
        {visibleComments}
      </div>
    );
  }

  setSortFn = sortFn => {
    this.setState({
      sortFn: sortFn
    });
    this.props.scanDocument();
  };

  setFilterFn = filter => {
    const filterFn = comment => comment.tags.includes(filter);
    this.setState({
      filterFn: filterFn
    });
    this.props.setActiveFilter(filter);
    this.props.scanDocument();
  };

  /* Called from the inline button handler handleCommentClick */
  beginCommenting = () => {
    this.setState({ commenting: true });
  };

  finishCommenting = () => {
    this.setState({
      commenting: false
    });
  };

  // Obtains the node, using the comment's uniqueKey
  // Warning: uniqueKey isn't unique with splitting lines.
  expandCommentAndFocus = async (id, fromInline) => {
    const { editor } = app;
    const newComment = this.props.comments.filter(
      comment => comment.uniqueKey === id
    )[0];
    const newData = this.getData(newComment);
    const newNode = editor.value.document.findDescendant(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === newComment.uniqueKey
    );

    if (this.state.expandedID === id) {
      // Do nothing but refocus if already is expanded
      app.editor.focus();
      return;
    } else if (this.state.expandedID === "") {
      // Set to focused if no previously focused exists.
      this.setState({ expandedID: id });
      newData.isFocused = true;
    } else {
      // Set the isFocused for the previously focused comment to false, newData.isFocused to true.
      const prevData = this.props.comments.filter(
        comment => comment.uniqueKey === this.state.expandedID
      )[0];
      prevData.isFocused = false;
      const prevNode = editor.value.document.findDescendant(
        node =>
          node.object === "inline" &&
          node.data.get("uniqueKey") === prevData.uniqueKey
      );
      editor.replaceNodeByKey(prevNode.key, {
        object: "inline",
        type: "comment",
        data: prevData,
        nodes: prevNode.nodes
      });

      this.setState({ expandedID: id });
      newData.isFocused = true;
    }
    await editor.replaceNodeByKey(newNode.key, {
      object: "inline",
      type: "comment",
      data: newData,
      nodes: newNode.nodes
    });
    this.pointToComment(newNode);
  };

  // Definitely modularize this later.
  // Maybe change the name of isFocused so it doesn't clash with Slate?
  getData = prevComment => {
    const uniqueKey = prevComment.uniqueKey;
    const start = prevComment.start;
    const end = prevComment.end;
    const quoted = prevComment.quoted;
    const tags = prevComment.tags;
    const timeStamp = prevComment.timeStamp;
    const suggestion = prevComment.suggestion;
    const isFocused = prevComment.isFocused;

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
    return data;
  };

  pointToComment = async target => {
    await app.editor.focus();
    app.editor.moveToStartOfNode(target);
  };
}

export default CommentPanel;
