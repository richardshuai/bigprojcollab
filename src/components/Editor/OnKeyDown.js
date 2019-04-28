import { findMarkHotkey } from "../Utils/Hotkeys";

export const onKeyDown = async (event, editor, next) => {
  //Hotkey handling
  const hotkeyProps = findMarkHotkey(event);
  if (hotkeyProps.containsKey) {
    event.preventDefault();
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  }

  return next();
};
