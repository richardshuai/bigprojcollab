import { findMarkHotkey } from "../Utils/Hotkeys";
import { app } from "../../App";

export const onKeyDown = (event, editor, next) => {
  //Hotkey handling
  const hotkeyProps = findMarkHotkey(event);
  if (hotkeyProps.containsKey) {
    event.preventDefault();
    const type = hotkeyProps.type;
    document.getElementById(type).click();
  }

  let comment;
  const isInComment = app.state.value.inlines.some(inline => {
    comment = inline;
    return inline.type === "comment";
  });

  if (isInComment) {
    console.log(comment.data.get("uniqueKey"));

    // console.log(
    //   JSON.stringify(
    //     comment
    //       .getLastText()
    //       .get("leaves")
    //       .first()
    //       .get("text")
    //   )
    // );
    //getInlinesByType
  }

  return next();
};
