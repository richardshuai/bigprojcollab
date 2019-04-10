import React, { Component } from "react";
import "./App.css";
import Toolbar from "./components/Toolbar/Toolbar";
import { Editor, getEventTransfer } from "slate-react";
import { Value } from "slate";

import isUrl from "is-url";

/* Handlers */
import { renderMark } from "./components/Editor/RenderMark";
import { renderNode } from "./components/Editor/RenderNode";
import { onKeyDown } from "./components/Editor/OnKeyDown";
import { onChange } from "./components/Editor/OnChange";

/* Initial value */
import initialValue from "./initialValue.json";

/* Plugins */
import CollapseOnEscape from "slate-collapse-on-escape";

import socketIOClient from "socket.io-client";

/* Export app for use by handlers */
export let app;

const plugins = [CollapseOnEscape()];

class App extends Component {
  state = {
    value: Value.fromJSON(initialValue),
    socket: "uninitialized",
    response: false
  };

  componentDidMount() {
    app = this;
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

  render() {
    if (!this.state.response) {
      return "Loading sockets...";
    }
    return (
      <div className="App">
        <h3>BigProj Text Editor</h3>
        <Toolbar state={this.state} editor={this.editor} />
        <div className="Editor">
          <Editor
            spellCheck
            autoFocus
            placeholder="Enter some rich text..."
            value={this.state.value}
            ref={this.ref}
            onPaste={this.onPaste}
            onChange={onChange}
            onKeyDown={onKeyDown}
            renderMark={renderMark}
            renderNode={renderNode}
            plugins={plugins}
          />
        </div>
      </div>
    );
  }

  /* Editor props */
  ref = editor => (this.editor = editor);

  onPaste = (event, editor, next) => {
    if (editor.value.selection.isCollapsed) return next();

    const transfer = getEventTransfer(event);
    const { type, text } = transfer;
    if (type !== "text" && type !== "html") return next();
    if (!isUrl(text)) return next();

    if (this.hasInline("link")) {
      editor.unwrapInline("link");
    }

    editor.command(this.wrapLink, text);
  };
}

export default App;
