import { KeyUtils } from "slate";
import { hasInline } from "../InlineButton";
import { app } from "../../../../App";

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
    const tag = [window.prompt("What tag would you like it to be?")];
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
    const data = { uniqueKey, suggestion, timeStamp, start, selection, tag };
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

export default handleCommentClick;
