import { app } from "../../App";

export const onChange = (event, editor, next) => {
  app.setState({ value: event.value }, () => {
    app.state.socket.emit("userEdit", JSON.stringify(event.value.toJSON()));
  });
};
