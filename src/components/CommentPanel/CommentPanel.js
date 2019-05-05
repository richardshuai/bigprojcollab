import React, { Component } from "react";
import SortByDropdown from "./CommentPanelComponents/SortByDropdown";
import FilterByTabs from "./CommentPanelComponents/FilterByTabs";
import AddCommentForm from "./CommentPanelComponents/AddCommentForm";
import CommentBox from "./CommentPanelComponents/CommentBox";
import { app } from "../../App";

import { getData } from "../Utils/GetData";

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
        <div style={this.commentContainerStyles}>
          {this.state.commenting ? (
            <AddCommentForm
              finishCommenting={this.finishCommenting}
              scanDocument={this.props.scanDocument}
              prevComment={this.state.prevComment}
            />
          ) : null}
          {visibleComments}
        </div>
      </div>
    );
  }

  /* Filter functions for SortByDropdown and FilterByDropdown */
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
    app.editor.focus().moveToFocus();
  };

  /* Handling clicking the commentBox from the commentPanel.
    Expands, highlights, and focuses on the comment */
  expandCommentAndFocus = async id => {
    const { editor } = app;

    if (this.state.expandedID === id) {
      // Do nothing but refocus if already is expanded
      app.editor.focus();
      return;
    }

    // Warning: uniqueKey isn't unique with splitting lines.
    const newComment = this.props.comments.filter(
      comment => comment.uniqueKey === id
    )[0];
    const newData = getData(newComment);
    const newNode = editor.value.document.findDescendant(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === newComment.uniqueKey
    );

    if (this.state.expandedID === "") {
      // Set to focused if no previously focused exists.
      this.setState({ expandedID: id });
      newData.isFocused = true;
    } else {
      // Set the isFocused for the previously focused comment to false, newData.isFocused to true.
      // Get comment data and change isFocused.
      const prevData = this.props.comments.filter(
        comment => comment.uniqueKey === this.state.expandedID
      )[0];
      prevData.isFocused = false;

      // Get node by uniqueKey
      const prevNode = editor.value.document.findDescendant(
        node =>
          node.object === "inline" &&
          node.data.get("uniqueKey") === prevData.uniqueKey
      );

      // Replace node by node key
      editor.replaceNodeByKey(prevNode.key, {
        object: "inline",
        type: "comment",
        data: prevData,
        nodes: prevNode.nodes
      });

      // Set newData to be focused, update expandedID
      this.setState({ expandedID: id });
      newData.isFocused = true;
    }

    // Replace newData with a true isFocused
    await editor.replaceNodeByKey(newNode.key, {
      object: "inline",
      type: "comment",
      data: newData,
      nodes: newNode.nodes
    });
    this.pointToComment(newNode);
  };

  pointToComment = async target => {
    await app.editor.focus();
    app.editor.moveToStartOfNode(target);
  };

  /* Styling */
  commentContainerStyles = {
    overflowY: "scroll",
    height: "430px"
  };
}

export default CommentPanel;
