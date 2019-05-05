import { hasInline } from "../InlineButton";
import { app } from "../../../../App";
import { panel } from "../../../CommentPanel/CommentPanel";

/*  Do not use start and selection as ways of keeping track where a node is. 
    These variables are only for the docOrderComparator, for now. */
const handleCommentClick = async () => {
  const { editor } = app;
  const { value } = editor;

  if (hasInline("comment")) {
    editor.unwrapInline("comment");
  } else if (value.selection.isExpanded) {
    panel.beginCommenting();
  }
};

export default handleCommentClick;
