import { findMarkHotkey } from "../Utils/Hotkeys";
import { app } from "../../App";
import { Document } from "slate";

export const onKeyDown = async (event, editor, next) => {
  //Hotkey handling
  const hotkeyProps = findMarkHotkey(event);

  if (hotkeyProps.containsKey) {
    event.preventDefault();
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  }

  //Comment update handling
  updateComment();

  return next();
};

const updateComment = () => {
  const { value } = app.state;
  const currentInline = value.inlines.first();
  const isInCommentData = isInComment(currentInline);

  if (isInCommentData.isInComment) {
    const { commentNode } = isInCommentData;
    const target = app.state.comments.filter(
      data => data["uniqueKey"] === commentNode.data.get("uniqueKey")
    )[0];
    target.quoted = commentNode.text;
  }
};

const isInComment = currNode => {
  if (!currNode || Document.isDocument(currNode)) {
    return { isInComment: false };
  } else if (currNode.type === "comment") {
    return { isInComment: true, commentNode: currNode };
  } else {
    return isInComment(app.state.value.document.getParent(currNode.key));
  }
};
