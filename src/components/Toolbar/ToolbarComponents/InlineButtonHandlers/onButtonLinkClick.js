import { app } from "../../../../App";
import { hasInline } from "../InlineButton";

const onButtonLinkClick = () => {
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

export default onButtonLinkClick;
