import React from "react";
import { app } from "../../../App";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";
import onButtonCommentClick from "./InlineButtonHandlers/onButtonCommentClick";
import onButtonLinkClick from "./InlineButtonHandlers/onButtonLinkClick";

/* Inlines */
export const renderInlineButton = function(type, icon) {
  const isActive = hasInline(type);
  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickButtonInline(event, type)}
      id={type}
    >
      <Icon className="button-icon">{icon}</Icon>{" "}
    </Button>
  );
};

export const hasInline = function(type) {
  return app.state.value.inlines.some(inline => inline.type === type);
};

const onClickButtonInline = function(event, type) {
  event.preventDefault();

  if (type === "comment") {
    onButtonCommentClick();
  } else if (type === "link") {
    onButtonLinkClick();
  }
};
