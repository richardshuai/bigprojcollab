import React from "react";
import { getEventTransfer } from "slate-react";
import isUrl from "is-url";
import { app } from "../../App";

export const onPaste = (event, editor, next) => {
  if (editor.value.selection.isCollapsed) return next();

  const transfer = getEventTransfer(event);
  const { type, text } = transfer;
  if (type !== "text" && type !== "html") return next();
  if (!isUrl(text)) return next();

  if (this.hasInline("link")) {
    editor.unwrapInline("link");
  }

  editor.command(this.wrapLink, text);
};
