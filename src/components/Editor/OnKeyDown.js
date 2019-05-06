import { findMarkHotkey } from "../Utils/Hotkeys";

export const onKeyDown = async (event, editor, next) => {
  //Hotkey handling
  const hotkeyProps = findMarkHotkey(event);
  if (hotkeyProps.containsKey) {
    event.preventDefault();
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  }
  /* For debugging for now */
  if (event.ctrlKey) {
    console.log(JSON.stringify(editor.value.document, null, 2));
  }

  return next();
};
