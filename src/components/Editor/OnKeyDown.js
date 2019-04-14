import { findMarkHotkey } from "../Utils/Hotkeys";

export const onKeyDown = (event, editor, next) => {
  const hotkeyProps = findMarkHotkey(event);
  if (hotkeyProps.containsKey) {
    event.preventDefault();
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  } else {
    return next();
  }
};
