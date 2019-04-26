import { KeyUtils } from "slate";
import { hasInline } from "../InlineButton";
import { app } from "../../../../App";
import { panel } from "../../../CommentPanel/CommentPanel";
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
    panel.setState({
      commenting: true
    });
  }
};

export default handleCommentClick;