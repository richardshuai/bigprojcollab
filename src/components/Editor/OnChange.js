import { app } from "../../App";
import { Range } from "slate";

export const onChange = (event, editor, next) => {
  // app.setState({ value: event.value }, () => {
  //   app.state.socket.emit("userEdit", JSON.stringify(event.value.toJSON()));
  // });
  app.setState({ value: event.value });
};
