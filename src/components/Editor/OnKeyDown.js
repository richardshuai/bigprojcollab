import { findMarkHotkey } from "../Utils/Hotkeys";
import { app } from "../../App";
import { Document, Range } from "slate";

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
  const { document } = value;

  /* Below is a failed implementation of checking for edits at the 
  margins of comments. It fails because moveBackward and moveForward don't
  move across nodes. Possible fixes include turning to Mozilla's API or learning
  more about Slate. */

  // let effectiveRange;
  // if (value.selection.isCollapsed) {
  //   effectiveRange = Range.create({
  //     anchor: value.selection.start.moveBackward(1),
  //     focus: value.selection.end.moveForward(1)
  //   });
  //   app.editor.deleteAtRange(effectiveRange);
  // } else {
  //   effectiveRange = value.selection;
  // }
  // const currentInlines = document.getLeafInlinesAtRange(effectiveRange);

  const currentInlines = document.getLeafInlinesAtRange(value.selection);

  let currentInline;

  if (currentInlines) {
    currentInline = currentInlines.first();
  }

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
