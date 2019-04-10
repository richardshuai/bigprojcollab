import React from "react";
import { Button } from "../../Utils/Buttons";
import Icon from "@material-ui/core/Icon";
import { app } from "../../../App";

/* Marks */
export const renderMarkButton = (type, icon) => {
  const isActive = hasMark(type);

  return (
    <Button
      className="button"
      active={isActive}
      onClick={event => onClickMark(event, type)}
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

export const onClickMark = (event, type) => {
  event.preventDefault();
  app.editor.toggleMark(type);
};
