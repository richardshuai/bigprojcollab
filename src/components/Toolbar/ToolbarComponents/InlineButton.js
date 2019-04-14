import React from "react";
import { app } from "../../../App";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";
import { Range } from "slate";
import { KeyUtils } from "slate";
import { Point } from "slate";

/* Inlines */
export const renderInlineButton = function(type, icon) {
  const isActive = hasInline(type);
  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickInline(event, type)}
      id={type}
    >
      <Icon className="button-icon">{icon}</Icon>{" "}
    </Button>
  );
};

export const hasInline = function(type) {
  return app.state.value.inlines.some(inline => inline.type === type);
};

export const onClickInline = function(event, type) {
  event.preventDefault();

  if (type === "comment") {
    handleCommentClick();
  } else if (type === "link") {
    handleLinkClick();
  }
};

//Can do this without async by using setState's callback, but that's messy?
/*  Do not use start and selection as ways of keeping track where a node is. 
    These variables are only for the docOrderComparator, for now. */
const handleCommentClick = async () => {
  const { editor } = app;
  const { value } = editor;

  if (hasInline("comment")) {
    editor.unwrapInline("comment");
    //TODO: Remove from CommentPanel
  } else if (value.selection.isExpanded) {
    const suggestion = window.prompt("What would you like to comment?");
    const selection = value.selection;
    const start = selection.start;

    if (suggestion == null) {
      alert("Nothing was entered!");
      return;
    }

    const date = new Date();
    const timeStamp = date.getTime();
    const uniqueKey = KeyUtils.create();

    //Comment data
    const data = { uniqueKey, suggestion, timeStamp, start, selection };
    await editor.wrapInline({
      type: "comment",
      data: data,
      key: uniqueKey
    });
    addComment(data);
  }
};

//Storing comments in app.state as comment data, not the nodes itself.
const addComment = commentData => {
  const updatedComments = [...app.state.comments, commentData];
  //Sorting by reverse timestamp
  // updatedComments.sort((a, b) => b.timeStamp - a.timeStamp);
  //Sorting by document order
  updatedComments.sort(docOrderComparator);
  app.setState({ comments: updatedComments });
};

/* TODO */

const docOrderComparator = (a, b) => {
  if (a.start.isBeforePoint(b.start)) {
    return -1;
  } else if (a.start.isAfterPoint(b.start)) {
    return 1;
  } else {
    return 0;
  }
};

const handleLinkClick = () => {
  const { editor } = app;
  const { value } = editor;

  if (hasInline("link")) {
    editor.unwrapInline("link");
  } else if (value.selection.isExpanded) {
    const href = window.prompt("Enter the URL of the link:");

    if (href == null) {
      return;
    }

    editor.command(wrapLink, href);
  } else {
    const href = window.prompt("Enter the URL of the link:");

    if (href == null) {
      return;
    }

    const text = window.prompt("Enter the text for the link:");

    if (text == null) {
      return;
    }

    editor
      .insertText(text)
      .moveFocusBackward(text.length)
      .command(wrapLink, href);
  }
};

const wrapLink = function(editor, href) {
  editor.wrapInline({
    type: "link",
    data: { href }
  });

  editor.moveToEnd();
};
