import React from "react";
import { app } from "../../App";

export const onChange = ({ value }) => {
  app.setState({ value: value }, () => {
    app.state.socket.emit("userEdit", JSON.stringify(value.toJSON()));
  });
};
