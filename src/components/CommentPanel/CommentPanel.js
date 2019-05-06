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
            pointToComment={this.pointToComment}
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

  /*  Handling clicking the commentBox from the commentPanel.
      Expands, highlights, and focuses on the comment 
      Note: Using fromClick=false (focusing from document) is a little bit wasteful, but probably hardly any performance difference */
  expandCommentAndFocus = async (id, fromClick) => {
    const { editor } = app;

    if (this.state.expandedID === id) {
      console.log("expandedID is same for expand and focus");
      // Do nothing but refocus if already is expanded
      if (app.editor.value.selection.isBlurred) {
        app.editor.focus();
      }
      return;
    }

    // Warning: uniqueKey isn't unique with splitting lines.
    const newComment = this.props.comments.filter(
      comment => comment.uniqueKey === id
    )[0];
    const newData = getData(newComment);

    const newNodes = editor.value.document.filterDescendants(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === newComment.uniqueKey
    );

    if (this.state.expandedID === "") {
      console.log("no previously expnaded ID");
      console.log(JSON.stringify(newNodes));
      // Set to focused if no previously focused exists.
      this.setState({ expandedID: id });
    } else {
      console.log("expanding everyhing");
      this.unexpandComment();

      // Set newData to be focused, update expandedID
      this.setState({ expandedID: id });
    }

    newData.isFocused = true;
    // Replace newData with a true isFocused
    await editor.replaceNodeByKey(newNodes.first().key, {
      object: "inline",
      type: "comment",
      data: newData,
      nodes: newNodes.first().nodes
    });
    const newFragments = newData.fragments;
    for (let i = 0; i < newFragments.length; i++) {
      newFragments[i].isFocused = true;
      editor.replaceNodeByKey(newNodes.get(i + 1).key, {
        object: "inline",
        type: "comment",
        data: newFragments[i],
        nodes: newNodes.get(i + 1).nodes
      });
    }
  };

  /* Unexpands a comment in the comment panel by using state expandedID */
  unexpandComment = () => {
    if (this.state.expandedID === "") {
      console.log("none expanded, unexpand");
      return;
    }

    console.log("unexpanding");
    const { editor } = app;
    // Set the isFocused for the previously focused comment to false, newData.isFocused to true.
    // Get comment data and change isFocused.
    const prevData = this.props.comments.filter(
      comment => comment.uniqueKey === this.state.expandedID
    )[0];
    prevData.isFocused = false;

    // Get node by uniqueKey
    const prevNodes = editor.value.document.filterDescendants(
      node =>
        node.object === "inline" &&
        node.data.get("uniqueKey") === prevData.uniqueKey
    );

    // Replace node by node key
    editor.replaceNodeByKey(prevNodes.first().key, {
      object: "inline",
      type: "comment",
      data: prevData,
      nodes: prevNodes.first().nodes
    });

    const prevFragments = prevData.fragments;
    for (let i = 0; i < prevFragments.length; i++) {
      prevFragments[i].isFocused = false;
      editor.replaceNodeByKey(prevNodes.get(i + 1).key, {
        object: "inline",
        type: "comment",
        data: prevFragments[i],
        nodes: prevNodes.get(i + 1).nodes
      });
    }
    this.setState({ expandedID: "" });
  };

  /* Takes in a node and puts cursor at beginning of node */
  pointToComment = async id => {
    const editor = app.editor;
    if (!target) {
      target = editor.value.document.findDescendant(
        node => node.object === "inline" && node.data.get("uniqueKey") === id
      );
    }
    if (editor.value.selection.isBlurred) {
      console.log("pointtocomment");
      await editor.focus();
    }
    editor.moveToStartOfNode(target);
  };

  /* Styling */
  commentContainerStyles = {
    overflowY: "scroll",
    height: "430px"
  };
}

export default CommentPanel;
