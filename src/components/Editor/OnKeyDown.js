import React from "react";
import { findMarkHotkey } from "../Utils/Hotkeys";

export const onKeyDown = (event, editor, next) => {
  const hotkeyProps = findMarkHotkey(event);
  if (hotkeyProps.containsKey) {
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  } else {
    return next();
  }

  event.preventDefault();
};