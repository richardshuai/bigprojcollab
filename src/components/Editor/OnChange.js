import { app } from "../../App";
import { Document, Range } from "slate";

export const onChange = change => {
  // app.setState({ value: event.value }, () => {
  //   app.state.socket.emit("userEdit", JSON.stringify(event.value.toJSON()));
  // });
  app.setState({ value: change.value });
};
