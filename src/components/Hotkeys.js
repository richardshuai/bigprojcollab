import { isKeyHotkey } from "is-hotkey";

const Hotkeys = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underlined"
};

export function findMarkHotkey(event) {
  const hotkeyProps = { containsKey: false, mark: "none" };
  for (const hotkey of Object.keys(Hotkeys)) {
    if (isKeyHotkey(hotkey)(event)) {
      hotkeyProps.containsKey = true;
      hotkeyProps.mark = Hotkeys[hotkey];
    }
  }
  return hotkeyProps;
}
