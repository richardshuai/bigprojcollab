import { app } from "../../App";
import { Document, Range } from "slate";

export const onChange = async change => {
  // app.setState({ value: event.value }, () => {
  //   app.state.socket.emit("userEdit", JSON.stringify(event.value.toJSON()));
  // });
  app.setState({ value: change.value });
  // console.log(JSON.stringify(change.operations, null, 2));
  // console.log(JSON.stringify(change.value, null, 2));

  const selectionOps = change.operations.filter(
    operation => operation.type === "set_selection"
  );
  console.log(JSON.stringify(selectionOps, null, 2));

  if (selectionOps.size >= 1) {
    handleSelectionChange(selectionOps);
  }
};

const handleSelectionChange = async selectionOps => {
  const { editor } = app;
  const { value } = editor;

  /* Only look at the focus when detecting if in comment */
  const currFocus = value.selection.focus;
  const collapsedToFocus = Range.create({
    anchor: currFocus,
    focus: currFocus
  });

  const isFocusNegative = selectionOps.some(op => {
    if (!op.get("properties").focus) {
      return false;
    }
    return op.get("properties").focus.offset === -1;
  });

  /* Case 2 */
  if (isFocusNegative) {
    await app.editor.moveBackward(1);
  }

  /* There should only ever be one bottom-most leaf inline in a collapsed range */
  const leafInlines = value.document.getLeafInlinesAtRange(collapsedToFocus);
  if (leafInlines.size === 1) {
    const commentNode = getLeafComment(leafInlines.first());
    // console.log("1 leaf inline detected.");
    /* Change to trigger only when moving right. This is to prevent case #1 */
    if (currFocus.offset === 0) {
      // console.log(value.focusText.text);
      if (value.focusText.text === "") {
        console.log("Case 1");
        await app.editor.moveForward(1);
      } else if (currFocus.offset === -1) {
        // await app.editor.moveForward(1);
      }
    } else if (currFocus.offset === -1) {
      // if (value.focusText.text === "") {
      //   await app.editor.moveBackward(1);
      // }
    }
    if (commentNode) {
      console.log(
        "Bottommost key should be: " + commentNode.data.get("uniqueKey")
      );
      // app.expandCommentFromInline(commentNode);
    }
  } else if (leafInlines.size > 1) {
    throw RangeError("More than one leafInline in collapsed range.");
  } else {
    // console.log("no leaf inline");
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
