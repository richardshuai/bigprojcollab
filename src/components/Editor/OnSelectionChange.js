/* Uses the native DOM selection, so use carefully */
import { app } from "../../App";
import { Document, Range } from "slate";
export const onSelectionChange = (event, editor) => {
  if (editor.value.selection.isBlurred) {
    return;
  }
  console.log("onselect");
  const { value } = editor;
  /* Only look at the focus when detecting if in comment */
  const currFocus = value.selection.focus;
  const collapsedToFocus = Range.create({
    anchor: currFocus,
    focus: currFocus
  });

  /* There should only ever be one bottom-most leaf inline in a collapsed range */
  const leafInlines = value.document.getLeafInlinesAtRange(collapsedToFocus);
  if (leafInlines.size === 1) {
    const commentNode = getLeafComment(leafInlines.first());
    if (commentNode) {
      console.log("Leaf inline detected?");
      console.log(
        "Bottommost key should be: " + commentNode.data.get("uniqueKey")
      );
      // app.expandCommentFromInline(commentNode);
      event.preventDefault();
    }
  } else if (leafInlines.size > 1) {
    throw RangeError("More than one leafInline in collapsed range.");
  } else {
    event.preventDefault();
    console.log("no leaf inline");
    // app.unexpandCommentFromInline();
  }
};

const getLeafComment = node => {
  while (node && !Document.isDocument(node)) {
    if (node.type === "comment") {
      return node;
    }
    node = node.getParent(node.key);
  }
  return;
};

const getParentComment = node => {};
