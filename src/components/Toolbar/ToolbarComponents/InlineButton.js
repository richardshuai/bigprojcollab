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

  const { editor } = app;
  const { value } = editor;

  if (type === "comment") {
    if (hasInline("comment")) {
      editor.unwrapInline("comment");
    } else if (value.selection.isExpanded) {
      const commentText = window.prompt("What would you like to comment?");

      if (commentText == null) {
        alert("Nothing was entered!");
        return;
      }
      editor.wrapInline({ type: "comment", data: { commentText } });
    }
  }
  if (type === "link") {
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
  }
};

export const wrapLink = function(editor, href) {
  editor.wrapInline({
    type: "link",
    data: { href }
  });

  editor.moveToEnd();
};
