import React from "react";
import { app } from "../../../App";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";
import handleCommentClick from "./InlineButtonHandlers/handleCommentClick";
import handleLinkClick from "./InlineButtonHandlers/handleLinkClick";

/* Inlines */
export const renderInlineButton = function(type, icon) {
  const isActive = hasInline(type);
  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickInline(event, type)}
      id={type}
    >
      <Icon className="button-icon">{icon}</Icon>{" "}
    </Button>
  );
};

export const hasInline = function(type) {
  return app.state.value.inlines.some(inline => inline.type === type);
};

const onClickInline = function(event, type) {
  event.preventDefault();

  if (type === "comment") {
    handleCommentClick();
  } else if (type === "link") {
    handleLinkClick();
  }
};
