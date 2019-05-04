import React from "react";
import { app } from "../../../App";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";

/* Marks */
export const renderMarkButton = (type, icon) => {
  const isActive = hasMark(type);

  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickButtonMark(event, type)}
      id={type}
    >
      <Icon className="button-icon">{icon}</Icon>
    </Button>
  );
};

export const hasMark = type => {
  const { value } = app.state;
  return value.activeMarks.some(mark => mark.type === type);
};

export const onClickButtonMark = (event, type) => {
  event.preventDefault();
  app.editor.toggleMark(type);
};
