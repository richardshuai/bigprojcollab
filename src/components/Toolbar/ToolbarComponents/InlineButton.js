import React from "react";
import { app } from "../../../App";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";

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
const handleCommentClick = async () => {
  const { editor } = app;
  const { value } = editor;

  if (hasInline("comment")) {
    editor.unwrapInline("comment");
  } else if (value.selection.isExpanded) {
    const suggestion = window.prompt("What would you like to comment?");
    const start = value.selection.start;

    if (suggestion == null) {
      alert("Nothing was entered!");
      return;
    }

    const date = new Date();
    const timeStamp = date.getTime();

    //Comment data
    const data = { suggestion, start, timeStamp };
    await editor.wrapInline({
      type: "comment",
      data: data
    });
    addComment(data);
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

const addComment = commentData => {
  app.setState({ comments: [...app.state.comments, commentData] });
};
