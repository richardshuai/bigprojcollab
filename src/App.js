import React, { Component } from "react";
import "./App.css";
import { Editor } from "slate-react";
import { Value } from "slate";
import socketIOClient from "socket.io-client";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            leaves: [
              {
                text: "A line of text in a paragraph."
              }
            ]
          }
        ]
      }
    ]
  }
});

class App extends Component {
  state = {
    value: initialValue,
    socket: "uninitialized",
    response: false
  };

  componentDidMount() {
    const socket = socketIOClient();
    socket.on("newUser", existingContent => {
      const updateValue = JSON.parse(existingContent);
      this.setState({ value: Value.fromJSON(updateValue) });
    });
    socket.on("receiveEdit", newContent => {
      this.setState({ value: Value.fromJSON(JSON.parse(newContent)) });
    });
    this.setState({ socket: socket, response: true });
  }

  // Is this necessary?
  /*
  componentWillUnmount() {
    socket.off("newUser");
    socket.off("receiveEdit");
  }
  */

  // On change, update the app's React state with the new editor value.
  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      this.setState({ value: value }, () => {
        this.state.socket.emit("userEdit", JSON.stringify(value.toJSON()));
      });
    }
  };

  // Render the editor.
  render() {
    if (!this.state.response) {
      return "Loading sockets...";
    }
    return (
      <div className="App">
        <h3>Hello! Slate Text Editor</h3>
        <div className="Editor">
          <Editor value={this.state.value} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default App;
